# T&I Project 4: Links
by Evgenii Astapov
## About
This website translates an Are.na collection about murals in New York City into an independent interactive web experience.

The original collection was initiated by my collaborator and curated around the theme of street murals across NYC. 
I expanded the collection with additional content and developed a custom website that reflects the visual direction and cultural atmosphere of the channel.

The goal was not to replicate Are.na’s interface, but to reinterpret the collection through spatial structure, interaction, and motion.

## Core concepts
Murals exist in physical space — layered, imperfect, expressive, often chaotic.
This website attempts to reflect that same energy digitally.

Instead of a neutral grid or standard archive layout, the interface embraces:

- Asymmetry
- Irregular masking
- Layered markers
- Spatial offsets
- Dynamic positioning

The structure mirrors the fragmented, layered nature of street surfaces in New York.

## Process & System

The website dynamically pulls content from the Are.na API and transforms structured channel data into custom-rendered components.

Each block type (Image, Text, Link, Video, Attachment) is interpreted through its own visual and structural logic. 
Instead of relying on a fixed grid, the layout uses conditional rendering, nth-child positional rules, and masking techniques to create controlled irregularity.

The system separates content logic from visual logic:

- API data is fetched and parsed via JavaScript
- Block types are rendered through modular functions
- Data attributes support filtering and modal behavior
- CSS masking defines visual identity per category
- Scroll behavior and navigation states are managed through IntersectionObserver

Interaction and motion are subtle but structural. Scroll-based shifts, layered positioning, and navigation visibility changes reinforce the idea of urban movement and visual density rather than decorative animation.

The project became an exploration of how structured data can be translated into expressive spatial composition.

## Learnings
- Working deeply with APIs and structured JSON
- Transforming dynamic data into expressive layouts
- Separating architecture from styling logic
- Advanced CSS masking techniques
- Managing responsive complexity without frameworks
- Building scalable rendering logic in vanilla JavaScript
