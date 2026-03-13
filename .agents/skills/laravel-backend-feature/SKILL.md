---
name: laravel-backend-feature
description: Implement Laravel backend features using thin controllers, Actions for writes, Queries for reads, FormRequests for validation, Policies for authorization, and Resources for response data.
license: MIT
---

## What this skill does

Implements backend features in Laravel using a strict layered architecture.

Read flow:

Controller → Query → Resource → Response

Write flow:

Controller → FormRequest → Policy → Action → Redirect

---

## When to use this skill

Use this skill when:

- Creating Laravel CRUD features
- Implementing domain operations (publish, like, follow, etc.)
- Creating controllers, actions, queries, policies, resources, or form requests
- Refactoring business logic out of controllers
- Implementing database read or write workflows

Do not use this skill for frontend work.

---

## Folder Structure

Use domain-based folders.

app/
- Actions/{Domain}/
- Queries/{Domain}/
- Http/Controllers/{Domain}/
- Http/Requests/{Domain}/
- Http/Resources/{Domain}/
- Policies/
- Models/

Example domain: Post

Actions/Post/
Queries/Post/
Http/Controllers/Post/
Http/Requests/Post/
Http/Resources/Post/

---

## Controller Rules

Controllers must remain thin.

Controllers must:

- authorize using policies
- call one Query OR one Action
- return a response or redirect

Controllers must NOT:

- contain business logic
- run complex queries
- call multiple actions
- handle transactions

Example:

```php
public function store(StorePostRequest $request, CreatePostAction $action)
{
    $this->authorize('create', Post::class);

    $post = $action->handle(
        $request->user(),
        $request->validated()
    );

    return redirect()->route('posts.show', $post);
}
```

---

## Queries (Read Layer)

Location:

app/Queries/{Domain}/

Rules:

- method name must be __invoke()
- queries only read data
- queries must never mutate data

Example:

```php
class ListPostsQuery
{
    public function __invoke()
    {
        return Post::query()
            ->latest()
            ->paginate();
    }
}
```

---

## Actions (Write Layer)

Location:

app/Actions/{Domain}/

Naming pattern:

Verb + Entity + Action

Examples:

CreatePostAction  
UpdatePostAction  
DeletePostAction  
PublishPostAction  
LikePostAction

Rules:

- method name must be handle()
- actions perform write operations
- actions may contain business logic
- actions may run transactions

Actions must NOT:

- return HTTP responses
- contain controller logic

Example:

```php
class CreatePostAction
{
    public function handle(User $user, array $data): Post
    {
        return Post::create([
            'title' => $data['title'],
            'user_id' => $user->id,
        ]);
    }
}
```

---

## Composite Actions

If a feature requires multiple steps, create a composite action.

Controllers must not call multiple actions.

Example workflow:

PublishPostAction

- UpdatePostStatusAction
- NotifyFollowersAction

Transactions should run inside the composite action.

---

## Form Requests

Location:

app/Http/Requests/{Domain}/

Responsibilities:

- validation rules only

Authorization must be handled in controllers using policies.

Example:

```php
class StorePostRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required','string','max:255'],
        ];
    }
}
```

---

## Policies

Location:

app/Policies/

Controllers must authorize actions using:

```php
$this->authorize('ability', $model);
```

Example:

```php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
```

---

## Resources

Location:

app/Http/Resources/{Domain}/

Rules:

- all responses must pass through a Resource
- never call ->resolve()

Usage:

```php
PostResource::collection($posts);

new PostResource($post);
```

---

## Naming Conventions

Queries → __invoke()

Actions → handle()

Domain Controllers → __invoke()

---

## Architecture Constraints

These rules must always be respected:

- Queries must never mutate data
- Actions must never return HTTP responses
- Controllers must never contain business logic
- Controllers must call only one Query OR one Action

---

## Generation Checklist

When implementing a feature create:

- Policy
- FormRequests
- Resource
- Actions
- Queries
- Controllers
