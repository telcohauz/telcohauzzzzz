"""Independent assisted adapters. No affiliate or publishing API is assumed."""
from dataclasses import dataclass
from .core import https, timestamp, now, uid


@dataclass(frozen=True)
class AssistedAdapter:
    platform_id: str
    automatic_publishing: bool = False
    automatic_product_refresh: bool = False

    def import_products(self, store, products):
        if len(products)>1000:
            raise ValueError('Import batch exceeds limit')
        if any(p.get('platform_id')!=self.platform_id for p in products):
            raise ValueError('Platform mismatch')
        return [store.import_product(p) for p in products]

    def publish(self, *args, **kwargs):
        raise NotImplementedError('Use official manual upload and record publication evidence')


class ShopeeMalaysia(AssistedAdapter):
    def __init__(self):
        super().__init__('shopee-my')


class TikTokMalaysia(AssistedAdapter):
    def __init__(self):
        super().__init__('tiktok-my')


ADAPTERS={'shopee-my':ShopeeMalaysia(), 'tiktok-my':TikTokMalaysia()}


def activate_assisted_account(store, evidence, actor):
    """Owner-only local command; requires documented official policy review, never identity substitution."""
    platform=evidence['platform_id']
    if platform not in ADAPTERS or evidence.get('country')!='MY' or evidence.get('owner_approval')!='ACTIVATE_ASSISTED_OPERATIONS':
        raise ValueError('Explicit Malaysian owner authorization required')
    # Keep DOB/identity/payment credentials out of this database; store evidence references.
    minimum=evidence['official_minimum_age']; holder=evidence['holder_meets_minimum_age']
    if not isinstance(minimum,int) or isinstance(minimum,bool) or minimum<18 or holder is not True:
        raise ValueError('Verified adult eligibility required; no automatic age-policy assumptions')
    for field in ('policy_source','eligibility_evidence','enrollment_evidence','payment_evidence'):
        https(evidence[field])
    checked=timestamp(evidence['policy_checked_at'])
    with store.db() as db:
        db.execute('UPDATE affiliate_platforms SET enabled=1,policy_source=?,policy_checked_at=? WHERE id=?',(evidence['policy_source'],checked,platform))
        db.execute('INSERT INTO affiliate_accounts VALUES(?,?,?,?,?,?,?,1) ON CONFLICT(id) DO UPDATE SET eligibility_evidence=excluded.eligibility_evidence,enrollment_evidence=excluded.enrollment_evidence,payment_evidence=excluded.payment_evidence,owner_approved_at=excluded.owner_approved_at,enabled=1',
                   (platform,platform,'MY',evidence['eligibility_evidence'],evidence['enrollment_evidence'],evidence['payment_evidence'],now()))
        store.require_account(db,platform)
        store.audit(db,actor,'ASSISTED_ACCOUNT_ACTIVATED',platform)
        db.execute('INSERT OR REPLACE INTO integration_status VALUES(?,?,?,?)',(platform,'ASSISTED_IMPORT_ONLY',evidence['policy_source'],now()))
