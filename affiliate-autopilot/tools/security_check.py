"""Small repository policy check; not a substitute for dependency/CVE scanning."""
import ast
from pathlib import Path

root=Path(__file__).resolve().parents[1]
violations=[]
for path in (root/'autopilot').glob('*.py'):
    tree=ast.parse(path.read_text())
    for node in ast.walk(tree):
        if isinstance(node,ast.Call):
            if any(k.arg=='shell' and isinstance(k.value,ast.Constant) and k.value.value is True for k in node.keywords):
                violations.append(str(path)+': shell=True')
            if isinstance(node.func,ast.Name) and node.func.id in ('eval','exec'):
                violations.append(str(path)+': dynamic code execution')
if violations:
    raise SystemExit('\n'.join(violations))
print('PASS: no shell=True, eval or exec in Autopilot Python modules. CVE scan remains separate.')
