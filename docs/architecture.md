# Architecture & Generation Flow

Basecompose uses a template-based generation pipeline:
1. User selects stack via UI
2. StackBlueprint object created
3. API `/api/generate` receives blueprint
4. Engine copies base scaffold, applies addons, merges Docker files, generates env docs
5. Project is archived and downloaded

See [GENERATION_FLOW.md](https://github.com/icancodefyi/basecompose/blob/main/GENERATION_FLOW.md) for details.
