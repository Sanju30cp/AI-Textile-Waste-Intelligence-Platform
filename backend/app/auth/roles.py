from fastapi import Depends, HTTPException, status

from app.auth.auth_handler import get_current_user


class RoleNames:
    ADMINISTRATOR = "Administrator"
    TEXTILE_MANUFACTURER = "Textile Manufacturer"
    RECYCLING_FACILITY_OPERATOR = "Recycling Facility Operator"
    SUSTAINABILITY_MANAGER = "Sustainability Manager"


def require_role(*allowed_roles):
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user

    return role_checker
