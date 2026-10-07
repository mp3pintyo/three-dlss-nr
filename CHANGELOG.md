# Changelog / Változásnapló

## 1.0.0 — 2026-10-07

### Magyar

- A fejlesztés, a pushok, a pull requestek és a GitHub Release-ek kizárólag az mp3pintyo/three-dlss-nr forkba kerülnek. A push előtti ellenőrzés más célpontot elutasít.
- A main ágra kerülő új funkciók és javítások az ellenőrzések után automatikus, szemantikus verziózású GitHub Release-t kapnak. A kiadáshoz kötelező a magyar és angol változásnapló. A fork nem publikál az eredeti npm-csomagba és nem telepít az eredeti Cloud Run szolgáltatásra.
- Magyar animált DLSS 5 / Three.js bemutató, képes összehasonlítás, élő demó, valamint érthető TSL és Reference WGSL súgó.
- Windows-indítók, helyi eszközkészlet és öt textúrázott modellből választható neurális demó.
- Gyorsabb félprecíziós TSL számítás, a Reference WGSL pipeline-ok újrafelhasználása és a modellfordítás megvárása.
- A kiadás tartalmazza a forrást, az épített könyvtár csomagját és a változásnaplót. A helyi futtatókörnyezet és a gyártói modellsúlyok nem részei a kiadásnak.

### English

- Development, pushes, pull requests and GitHub Releases exclusively target the mp3pintyo/three-dlss-nr fork. The pre-push guard rejects other destinations.
- New features and fixes merged into main automatically receive a semantic GitHub Release after checks. Hungarian and English changelog entries are mandatory. The fork does not publish to the upstream npm package or deploy to the upstream Cloud Run service.
- Hungarian animated DLSS 5 / Three.js presentation with image comparison, a live demo and plain-language TSL and Reference WGSL help.
- Windows launchers, a local toolchain and a neural demo with five selectable textured models.
- Faster half-precision TSL computation, reused Reference WGSL pipelines and correct waiting for model compilation.
- Releases include source archives, the built library tarball and the changelog. Local runtime files and proprietary model weights are excluded.
