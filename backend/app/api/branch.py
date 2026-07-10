from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.schemas.branch import BranchCreate

from app.crud.branch import (
    create_branch,
    get_branches
)

from app.api.dependencies import get_db


router = APIRouter(
    prefix="/branches",
    tags=["Branches"]
)


@router.post("/")
def create(
    branch: BranchCreate,
    db: Session = Depends(get_db)
):

    return create_branch(
        db,
        branch
    )


@router.get("/{tenant_id}")
def list_branches(
    tenant_id: str,
    db: Session = Depends(get_db)
):

    return get_branches(
        db,
        tenant_id
    )
