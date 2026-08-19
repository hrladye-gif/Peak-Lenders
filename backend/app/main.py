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


app = FastAPI(
    title="Peak Lenders API",
    version="1.0.0"
)

app.include_router(risk_router)
app.include_router(auth_router)
app.include_router(tenant_router)
app.include_router(branch_router)
app.include_router(borrower_router)
app.include_router(group_router)
app.include_router(loan_router)
app.include_router(loan_product_router)
app.include_router(loan_workflow_router)
app.include_router(repayment_router)
app.include_router(schedule_router)
app.include_router(collection_router)
app.include_router(write_off_router)
app.include_router(dashboard_router)
app.include_router(application_router)


@app.get("/")
def root():

    return {
        "status": "running",
        "app": "Peak Lenders"
    }
