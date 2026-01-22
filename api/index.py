import sys
import os

# Loyiha ildizini sys.path ga qo'shish
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if project_root not in sys.path:
    sys.path.append(project_root)

from backend.app.main import app
