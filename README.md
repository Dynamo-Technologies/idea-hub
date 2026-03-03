# Dynamo Idea Hub

Internal tool for submitting and managing ideas tied to contracts and use cases. Employees sign in with Microsoft 365, submit ideas through a form, and each submission is saved to Supabase and automatically creates a Jira ticket on the INNOVATION board.

## Tech Stack

- **SvelteKit** with TypeScript
- **Tailwind CSS** v4 (dark mode via `class` strategy)
- **Supabase** — database for idea storage + auth provider
- **Microsoft Entra ID** (Azure AD) — SSO login for `@dynamo.works` users
- **Jira** — automatic ticket creation on the INNOVATION board
- **Docker** — containerized deployment on AWS EC2

## Features

- Microsoft 365 SSO login (restricted to `@dynamo.works` org)
- Idea submission form (name, email, contract/use case, description)
- Submissions stored in Supabase `ideas` table
- Automatic Jira ticket creation with each submission
- Tickets placed in the "Ideas" column on the INNOVATION board
- Dark mode support

## Environment Variables

| Variable | Description |
|---|---|
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `JIRA_URL` | Jira instance URL (e.g. `https://dynamohq.atlassian.net`) |
| `JIRA_EMAIL` | Email for Jira API authentication |
| `JIRA_API_TOKEN` | Jira API token ([create here](https://id.atlassian.com/manage-profile/security/api-tokens)) |
| `JIRA_PROJECT_KEY` | Jira project key (e.g. `INNOVATION`) |
| `ORIGIN` | App URL for SvelteKit (e.g. `https://ideas.dynamo.works`) |

## Local Development

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with the variables listed above.

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)

## Docker

Build and run locally:

```bash
docker build -t idea-hub .
docker run -d -p 3000:3000 \
  -e ORIGIN=http://localhost:3000 \
  -e PUBLIC_SUPABASE_URL="..." \
  -e PUBLIC_SUPABASE_ANON_KEY="..." \
  -e JIRA_URL="..." \
  -e JIRA_EMAIL="..." \
  -e JIRA_API_TOKEN="..." \
  -e JIRA_PROJECT_KEY="..." \
  --name idea-hub \
  idea-hub
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## EC2 Deployment

The app is deployed on AWS EC2 at `https://ideas.dynamo.works`.

### SSH Access

```bash
ssh -i ~/.ssh/idea-hub-key.pem ec2-user@<ec2-public-ip>
```

### Rebuild & Redeploy

On the EC2 instance:

```bash
cd ~/idea-hub
docker stop idea-hub && docker rm idea-hub
docker build --no-cache -t idea-hub .
docker run -d -p 3000:3000 \
  -e ORIGIN=https://ideas.dynamo.works \
  -e PUBLIC_SUPABASE_URL="..." \
  -e PUBLIC_SUPABASE_ANON_KEY="..." \
  -e JIRA_URL="..." \
  -e JIRA_EMAIL="..." \
  -e JIRA_API_TOKEN="..." \
  -e JIRA_PROJECT_KEY="..." \
  --restart unless-stopped \
  --name idea-hub \
  idea-hub
```

### Useful Commands

| Task | Command |
|---|---|
| View logs | `docker logs -f idea-hub` |
| Restart | `docker restart idea-hub` |
| Stop | `docker stop idea-hub` |
| Check status | `docker ps` |

## Supabase Schema

```sql
create table ideas (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null default '',
  contract text not null,
  description text not null,
  created_at timestamptz default now()
);

-- RLS policies
alter table ideas enable row level security;
create policy "Allow all inserts" on ideas for insert with check (true);
create policy "Allow all selects" on ideas for select using (true);
```

## External Service Configuration

### Microsoft Entra ID (Azure AD)

- App registration: "Dynamo Idea Hub" in Azure Portal
- Supported account types: Single tenant (`@dynamo.works` only)
- Redirect URI: `https://<supabase-project>.supabase.co/auth/v1/callback`
- API permissions: `email`, `openid`, `profile`, `User.Read`
- Token configuration: `email` optional claim added to ID token

### Supabase Auth

- Azure provider enabled with Entra ID client ID, secret, and tenant URL
- Site URL: `https://ideas.dynamo.works`
- Redirect URL: `https://ideas.dynamo.works/auth/callback`

### Jira Integration

- Tickets created as Tasks on the INNOVATION project
- Automatically transitioned to the "Ideas" column (transition ID 4)
- Ticket summary format: `[Idea Hub] {contract} — {name}`
- Reporter defaults to the API token owner
