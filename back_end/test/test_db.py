import pytest
from db import DB

# Setup DB instance before each test
@pytest.fixture
def db():
    return DB()

# Test adding a new SOP
def test_add_sop(db):
    # Adding a new SOP
    result = db.add_sop("SA6117")
    assert result == True, f'SOP already existed'
    
