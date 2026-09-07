"""enhance savings controls

Revision ID: 4e20eeaf21b9
Revises: a73241c20c8c
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "4e20eeaf21b9"
down_revision: Union[str, Sequence[str], None] = "a73241c20c8c"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ============================================================
    # SAVINGS PRODUCTS
    # ============================================================

    op.add_column(
        "savings_products",
        sa.Column(
            "product_type",
            sa.String(),
            nullable=False,
            server_default="VOLUNTARY",
        ),
    )

    op.add_column(
        "savings_products",
        sa.Column(
            "interest_frequency",
            sa.String(),
            nullable=False,
            server_default="NONE",
        ),
    )

    op.add_column(
        "savings_products",
        sa.Column(
            "opening_minimum_balance",
            sa.Numeric(18, 2),
            nullable=False,
            server_default="0.00",
        ),
    )

    op.add_column(
        "savings_products",
        sa.Column(
            "withdrawal_minimum_balance",
            sa.Numeric(18, 2),
            nullable=False,
            server_default="0.00",
        ),
    )

    op.add_column(
        "savings_products",
        sa.Column(
            "allow_withdrawals",
            sa.Boolean(),
            nullable=False,
            server_default="true",
        ),
    )

    op.add_column(
        "savings_products",
        sa.Column(
            "allow_deposits",
            sa.Boolean(),
            nullable=False,
            server_default="true",
        ),
    )

    op.create_index(
        "uq_savings_products_tenant_code",
        "savings_products",
        ["tenant_id", "code"],
        unique=True,
    )

    # ============================================================
    # SAVINGS ACCOUNTS
    # ============================================================

    op.add_column(
        "savings_accounts",
        sa.Column(
            "account_type",
            sa.String(),
            nullable=False,
            server_default="VOLUNTARY_SAVINGS",
        ),
    )

    op.add_column(
        "savings_accounts",
        sa.Column(
            "opening_date",
            sa.Date(),
            nullable=False,
            server_default=sa.text("CURRENT_DATE"),
        ),
    )

    op.add_column(
        "savings_accounts",
        sa.Column(
            "closing_date",
            sa.Date(),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_accounts",
        sa.Column(
            "closure_reason",
            sa.String(),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_accounts",
        sa.Column(
            "last_transaction_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_accounts",
        sa.Column(
            "created_by",
            sa.String(),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_accounts",
        sa.Column(
            "closed_by",
            sa.String(),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_accounts",
        sa.Column(
            "branch_id",
            sa.String(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "savings_accounts_created_by_fkey",
        "savings_accounts",
        "users",
        ["created_by"],
        ["id"],
    )

    op.create_foreign_key(
        "savings_accounts_closed_by_fkey",
        "savings_accounts",
        "users",
        ["closed_by"],
        ["id"],
    )

    op.create_foreign_key(
        "savings_accounts_branch_id_fkey",
        "savings_accounts",
        "branches",
        ["branch_id"],
        ["id"],
    )

    # ============================================================
    # SAVINGS TRANSACTIONS
    # ============================================================

    op.add_column(
        "savings_transactions",
        sa.Column(
            "payment_method",
            sa.String(),
            nullable=False,
            server_default="CASH",
        ),
    )

    op.add_column(
        "savings_transactions",
        sa.Column(
            "effective_date",
            sa.Date(),
            nullable=False,
            server_default=sa.text("CURRENT_DATE"),
        ),
    )

    op.add_column(
        "savings_transactions",
        sa.Column(
            "initiated_by",
            sa.String(),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_transactions",
        sa.Column(
            "reversed_transaction_id",
            sa.String(),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_transactions",
        sa.Column(
            "reversal_reason",
            sa.Text(),
            nullable=True,
        ),
    )

    op.add_column(
        "savings_transactions",
        sa.Column(
            "notes",
            sa.Text(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "savings_transactions_initiated_by_fkey",
        "savings_transactions",
        "users",
        ["initiated_by"],
        ["id"],
    )

    op.create_foreign_key(
        "savings_transactions_reversed_transaction_id_fkey",
        "savings_transactions",
        "savings_transactions",
        ["reversed_transaction_id"],
        ["id"],
    )

    op.create_index(
        "uq_savings_transactions_reference_no",
        "savings_transactions",
        ["reference_no"],
        unique=True,
        postgresql_where=sa.text("reference_no IS NOT NULL"),
    )


def downgrade() -> None:
    op.drop_index(
        "uq_savings_transactions_reference_no",
        table_name="savings_transactions",
    )

    op.drop_constraint(
        "savings_transactions_reversed_transaction_id_fkey",
        "savings_transactions",
        type_="foreignkey",
    )

    op.drop_constraint(
        "savings_transactions_initiated_by_fkey",
        "savings_transactions",
        type_="foreignkey",
    )

    op.drop_column("savings_transactions", "notes")
    op.drop_column("savings_transactions", "reversal_reason")
    op.drop_column("savings_transactions", "reversed_transaction_id")
    op.drop_column("savings_transactions", "initiated_by")
    op.drop_column("savings_transactions", "effective_date")
    op.drop_column("savings_transactions", "payment_method")

    op.drop_constraint(
        "savings_accounts_branch_id_fkey",
        "savings_accounts",
        type_="foreignkey",
    )

    op.drop_constraint(
        "savings_accounts_closed_by_fkey",
        "savings_accounts",
        type_="foreignkey",
    )

    op.drop_constraint(
        "savings_accounts_created_by_fkey",
        "savings_accounts",
        type_="foreignkey",
    )

    op.drop_column("savings_accounts", "branch_id")
    op.drop_column("savings_accounts", "closed_by")
    op.drop_column("savings_accounts", "created_by")
    op.drop_column("savings_accounts", "last_transaction_at")
    op.drop_column("savings_accounts", "closure_reason")
    op.drop_column("savings_accounts", "closing_date")
    op.drop_column("savings_accounts", "opening_date")
    op.drop_column("savings_accounts", "account_type")

    op.drop_index(
        "uq_savings_products_tenant_code",
        table_name="savings_products",
    )

    op.drop_column("savings_products", "allow_deposits")
    op.drop_column("savings_products", "allow_withdrawals")
    op.drop_column("savings_products", "withdrawal_minimum_balance")
    op.drop_column("savings_products", "opening_minimum_balance")
    op.drop_column("savings_products", "interest_frequency")
    op.drop_column("savings_products", "product_type")
