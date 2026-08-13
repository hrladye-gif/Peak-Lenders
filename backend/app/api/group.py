from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.group import (
    GroupCreate,
    GroupResponse,
    GroupMemberCreate,
    GroupMemberResponse,
)
from app.crud.group import (
    create_group,
    get_groups,
    get_group,
    add_group_member,
)

router = APIRouter(
    prefix="/groups",
    tags=["Groups"],
)


@router.post(
    "",
    response_model=GroupResponse,
    status_code=status.HTTP_201_CREATED,
)
def create(
    data: GroupCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_group(
        db,
        data,
        current_user.tenant_id,
        current_user.branch_id,
    )


@router.get(
    "",
    response_model=list[GroupResponse],
)
def list_groups(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_groups(
        db,
        current_user.tenant_id,
    )


@router.get(
    "/{group_id}",
    response_model=GroupResponse,
)
def detail(
    group_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = get_group(
        db,
        group_id,
        current_user.tenant_id,
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found",
        )

    return group


@router.post(
    "/{group_id}/members",
    response_model=GroupMemberResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_member(
    group_id: str,
    data: GroupMemberCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    group = get_group(
        db,
        group_id,
        current_user.tenant_id,
    )

    if not group:
        raise HTTPException(
            status_code=404,
            detail="Group not found",
        )

    member, error = add_group_member(
        db,
        group,
        data,
    )

    if error:
        raise HTTPException(
            status_code=400,
            detail=error,
        )

    return member
