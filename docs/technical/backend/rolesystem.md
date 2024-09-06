# Role System

The role system in Samfundet4 builds on the Django "authentication backend" concept. Our system adds
a [custom auth backend](https://docs.djangoproject.com/en/5.0/topics/auth/customizing/). The goal of the system is to
enable us to answer queries like:

> Does Bob have access to edit case document X, which belongs to the UKA organization?
>
>Does Bob have access to view recruitment position X, which belongs to Web (a section of MG in the Samfundet
> organization)

The system uses hierarchical permission checking. It first checks if a user has a permission to a specific object on the
Organizational level, then Gang level, and finally the Gang Section level. This means that if a user has a specific
permission for an object on the Organizational level, they also have it on the Gang and Gang Section levels. And if a
user has it on the Gang level, they also have it on the Gang Section level.

## Real-world example

Before we get into the technical details of the system, it's important to know how the system is used, so here's a
real-world example.

Say we have a "Interviewer" role. This role gives permissions to view and manage interviews in a recruitment. If the
user is given this role on the Organization level, it means they are able to manage absolutely all interviews for gangs
and sections which belong to the organization. If they are given the role on the Gang level, they are able to manage all
interviews for the gang and the gang's sections. And finally, if they are given the role on the Gang Section level, they
are only able to manage interviews belonging to the gang section.

## Organization/Gang/Section resolvers

For the auth backend to know what organization an object belongs to, models need to implement
the `resolve_org`/`resolve_gang`/`resolve_section` methods. The purpose of these resolvers is to return the
org/gang/section the object belongs to. Models implementing these methods may not have ambiguous ownership, or be owned
by multiple orgs/gangs/sections.

> Example: The Tag model doesn't implement these methods, as they aren't "owned" by anybody
>
> Example: A Recruitment is owned by an organization, therefore `resolve_org` returns that organization.

These resolver methods only have a single parameter: `return_id`. The purpose of this argument is to avoid having to
unnecessarily fetch a whole instance from the database, when we only need the ID. All models which implement the
resolvers must respect this argument if possible.

Here's an example implementation of `resolve_org` for the Recruitment model:

```python
class Recruitment(CustomBaseModel):
    ...
    organization = models.ForeignKey(to=Organization)

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        if return_id:
            return self.organization_id
        return self.organization
```

And another example, showing how models can just call each other's resolvers to greatly simplify things:

```python
class RecruitmentPosition(CustomBaseModel):
    ...
    gang = models.ForeignKey(to=Gang)

    def resolve_org(self, *, return_id: bool = False) -> Organization | int:
        return self.gang.resolve_org(return_id=return_id)
```

## Role

A Role simply contains a name and a list of permissions. An "Interviewer" Role may for example contain permissions
related to interviews, interview rooms, applications, etc.

## Organization/Gang/Section User Roles

To tie users together to roles, we use either `UserOrgRole`/`UserGangRole`/`UserGangSectionRole`. These models contain
three fields: user, role, and object. For `UserOrgRole`, the obj will be an instance of Organization, for `UserGangRole`
it'll be an instance of Gang, and for `UserGangSectionRole` it'll be an instance of a GangSection.

To reiterate: if we create a `UserOrgRole` instance, it gives the user all of the role's permissions for the given
organization.

## Inheritance

There is no inheritance in our system, as that often leads to unnecessary complexity, both in the code and in our mental
understanding of how a specific role – or a set of roles – operates. If something is wrong with a role's permissions,
you can simply fix it then and there, instead of looking up and down the inheritance tree to see where the issue is.
