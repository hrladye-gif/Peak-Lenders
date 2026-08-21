from fastapi import FastAPI
from app.api.risk import router as risk_router
from app.api.auth import router as auth_router
from app.api.tenant import router as tenant_router
from app.api.branch import router as branch_router
from app.api.borrower import router as borrower_router
from app.api.group import router as group_router
from app.api.loan import router as loan_router
from app.api.loan_product import router as loan_product_router
from app.api.loan_workflow import router as loan_workflow_router
from app.api.repayment import router as repayment_router
from app.api.schedule import router as schedule_router
from app.api.collection import router as collection_router
from app.api.write_off import router as write_off_router
from app.api.dashboard import router as dashboard_router
from app.api.application import router as application_router
from app.api.savings import router as savings_router
from app.api.accounting import router as accounting_router

app = FastAPI(
    title="Peak Lenders API",
    version="1.0.0"
)

app.include_router(risk_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(tenant_router, prefix="/api")
app.include_router(branch_router, prefix="/api")
app.include_router(borrower_router, prefix="/api")
app.include_router(group_router, prefix="/api")
app.include_router(loan_router, prefix="/api")
app.include_router(loan_product_router, prefix="/api")
app.include_router(loan_workflow_router, prefix="/api")
app.include_router(repayment_router, prefix="/api")
app.include_router(schedule_router, prefix="/api")
app.include_router(collection_router, prefix="/api")
app.include_router(write_off_router, prefix="/api")
app.include_router(dashboard_router, prefix="/api")
app.include_router(application_router, prefix="/api")
app.include_router(savings_router, prefix="/api")

app.include_router(accounting_router, prefix="/api")
