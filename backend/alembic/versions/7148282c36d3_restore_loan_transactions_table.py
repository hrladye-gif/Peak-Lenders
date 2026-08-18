"""restore loan transactions table

Revision ID: 7148282c36d3
Revises: 2236f9325153
Create Date: 2026-08-18 07:23:29.666821

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '7148282c36d3'
down_revision: Union[str, Sequence[str], None] = '2236f9325153'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
