# Permission System Overview

The permission system is built on top of Django Rest Framework's (DRF) default permission system, using both **model-level permissions** and **object-level permissions**. This document explains how these permissions work and how they should be applied to views.

## Model-Level Permissions
Model-level permissions define access rights for all instances of a model.
- **Instance**: A specific realization of a model. For example, "Markedsføringsgjengen" (MG) is an instance of the model "Gang".
- Available actions:
  - **Read**: View all instances of the model
  - **Write**: Modify any instance of the model
  - **Delete**: Remove any instance of the model
  - **Create**: Create new instances of the model

If a user has a model-level permission, they can perform the specified action on any instance of that model.

## Object-Level Permissions
Object-level permissions restrict access to individual instances of a model.
- These permissions determine if a user can perform an action on a specific instance.
- A user may not have the necessary model-level permission but still have access  at the object level.



## The Role System
More details can be found in the role system documentation: [rolesystem docs](rolesystem.md)

### Summary
Users are assigned roles that define their permissions for specific objects. The role system has three levels:
- **Org roles**: Permissions across an entire organization
- **Gang roles**: Permissions for a specific gang
- **Gang Section roles**: Permissions for a section within a gang

Roles grant object-level permissions when they include access to a specific action on an object.

### How It Works
- A model must implement a **resolve_<org | gang | section>()** function for the role system to apply.
- Example:
  - A user with the **Gjengsjef** role for the MG gang has **[Read, Create, Delete, Modify]** permissions on the **Gang** model.
  - If the user tries to edit the "MG" gang, the role system grants access.
  - If the user tries to edit another gang (e.g., "DG"), but the **resolve_gang()** function returns "DG", the role system denies access.

## Applying Permissions to Views
Permissions are enforced using **permission classes** in DRF. These classes define who can access a view.

### Common Permission Classes
The most frequently used permission classes are defined in the **permission_classes** file:

- **SuperUserPermission**: Only superusers can access the view.
- **RoleProtectedObjectPermissions**: Protects all HTTP methods and checks permissions using both the default Django system and the Samf role system. 
- **RoleProtectedOrAnonReadOnlyObjectPermissions**: Similar to `RoleProtectedObjectPermissions`, but allows unrestricted access to **GET, HEAD, OPTIONS** requests.

### Important Note on Querysets
Permission classes **do not automatically filter querysets**.
- If a user has a role granting `view_recruitment_applications` permission for a single gang, the permission class will allow their request.
- However, to prevent them from seeing applications for other gangs, the queryset must be filtered manually.
- Use the `filter_queryset_by_permissions()` function (defined in `permission_classes`) to ensure users only see objects they have access to.

## Summary
- Model-level permissions control access to **all instances** of a model.
- Object-level permissions control access to **specific instances** of a model.
- The role system assigns object-level permissions based on user roles.
- Permission classes enforce access control in views.
- Querysets must be **manually filtered** to prevent unauthorized data exposure.

Following these principles ensures proper access control and security across the system.

