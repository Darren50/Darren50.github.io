---
layout: page
title: XR Model Portal
heading: XR Model Portal
subtitle: DSTA internship · 2022 · Laravel, PHP, JavaScript, SQL Server, Blender API
permalink: /work/xr-model-portal/
back:
  title: All work
  url: /work/
---

<script type="module" src="https://unpkg.com/@google/model-viewer@3.5.0/dist/model-viewer.min.js"></script>

![XR Model Portal home page](/images/XRmodelportal.jpg)

**Project summary:** DSTA needed a consolidated 3D model repository to host, share and interact with 3D models, to
improve the productivity of the organisation.

At the start, this project seemed stressful for someone who hadn't done web development before. I had to decide how to
store, display and share the 3D models, and these features were must-haves:

- User authentication
- Augmented Reality (AR) view
- File conversion

To begin, I looked for the best modules, libraries and languages for the job, and stumbled upon **modelviewer.dev**, a
library by Google that displays .glTF and .GLB models on the web using WebGL.

![modelviewer.dev documentation](/images/mvdPic.PNG)

It let me display models without having to learn **Three.js**, which would have taken much longer. Here it is in
action. Drag to rotate:

<model-viewer src="/models/village.glb" shadow-intensity="1" camera-controls auto-rotate touch-action="pan-y"></model-viewer>

I then tinkered with **PHP** and **XAMPP**, learnt the basics, and built a simple web app with the core features:
downloading, uploading and displaying models.

![Early prototype of the 3D asset manager](/images/3DAMprototype.PNG)

Next came the 3D file converter. This was the hardest part of the project, as there were hardly any resources on it.
DSTA's format was OpenFlight (.FLT), which is old and unconventional. After scouring the internet, I found only one
free tool that could handle it: **ModelConverterX**.

![ModelConverterX interface](/images/MCX.png)

Kind users on the forums helped me get the converter running on the web.

I wished that was it, but MCX only converted OpenFlight to .OBJ. Its .glTF output was split into multiple files, which
model-viewer doesn't support, so I used Blender as a Python module to finish the conversion. The final pipeline:

![Final file conversion pipeline](/images/fileConversionProcess.PNG)

I then moved the project to a web framework. Raw PHP could do everything, but frameworks come with things like user
authentication out of the box. Since I was already using PHP, I chose **Laravel**, migrated my code over, and added an
admin panel and user authentication.

Other features I added along the way:

- Zipped download of multiple models
- Augmented Reality (AR) view
- PDF export of the model list
- User access rights, so users only see models at their level
- KML file download
- Cart system

![Augmented reality view on a phone](/images/ARview.png){: .phone}

I deployed the app on two virtual machines, one for storage and one for the web app, which makes it easier to scale
storage or compute independently:

![Final deployment architecture](/images/finalDeploymentACT.PNG)

To sum up: was this the most polished project? No. Was it coded the best way possible? No. Did I learn a lot?
Definitely. Beyond web development, this internship taught me self-directed learning, which I'll carry with me as I
keep becoming a better engineer.
