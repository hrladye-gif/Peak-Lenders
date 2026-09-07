from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.branch import (
    BranchCreate,
    BranchUpdate,
)
from app.crud.branch import (
    create_branch,
    get_branches,
    get_branch,
    update_branch,
    set_branch_status,
)
from app.api.dependencies import (
    get_db,
    require_permission,
)
from app.services.audit_service import create_audit_log


router = APIRouter(
    prefix="/branches",
    tags=["Branches"],
)


@router.post("/")
def create(
    branch: BranchCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("branches.manage")),
):
    if branch.tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot create a branch for another institution.",
        )

    try:
        created = create_branch(db, branch)

        create_audit_log(
            db=db,
            tenant_id=current_user.tenant_id,
            entity_type="Branch",
            entity_id=created.id,
            action="BRANCH_CREATED",
            performed_by=current_user.id,
            details=f"Created branch {created.name} ({created.code}).",
        )

        db.commit()
        db.refresh(created)

        return created

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.get("/{tenant_id}")
def list_branches(
    tenant_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("branches.read")),
):
    if tenant_id != current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access branches belonging to another institution.",
        )

    return get_branches(db, tenant_id)


@router.patch("/{branch_id}")
def update(
    branch_id: str,
    branch: BranchUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("branches.manage")),
):
    existing = get_branch(
        db,
        branch_id,
        current_user.tenant_id,
    )

    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Branch not found.",
        )

    changes = []

    if branch.name is not None and branch.name != existing.name:
        changes.append("name")
    if branch.code is not None and branch.code != existing.code:
        changes.append("code")
    if branch.address is not None and branch.address != existing.address:
        changes.append("address")

    try:
        updated = update_branch(db, existing, branch)

        if changes:
            create_audit_log(
                db=db,
                tenant_id=current_user.tenant_id,
                entity_type="Branch",
                entity_id=updated.id,
                action="BRANCH_UPDATED",
                performed_by=current_user.id,
                details="Updated branch fields: " + ", ".join(changes) + ".",
            )

        db.commit()
        db.refresh(updated)

        return updated

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc


@router.patch("/{branch_id}/status")
def update_status(
    branch_id: str,
    is_active: bool,
    db: Session = Depends(get_db),
    current_user=Depends(require_permission("branches.manage")),
):
    existing = get_branch(
        db,
        branch_id,
        current_user.tenant_id,
    )

    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Branch not found.",
        )

    try:
        updated = set_branch_status(
            db,
            existing,
            is_active,
        )

        create_audit_log(
            db=db,
            tenant_id=current_user.tenant_id,
            entity_type="Branch",
            entity_id=updated.id,
            action="BRANCH_ACTIVATED" if is_active else "BRANCH_DEACTIVATED",
            performed_by=current_user.id,
            details=(
                f"Branch {updated.name} was "
                f"{'activated' if is_active else 'deactivated'}."
            ),
        )

        db.commit()
        db.refresh(updated)

        return updated

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
