---
layout: default
title: Home
---

# Hi, I'm Darren.

I'm a Year 2 Computer Engineering student at the [National University of Singapore](https://www.nus.edu.sg). I like building
things that sit between hardware and software, and I write about what I learn along the way.

## Now

<!-- Update this section every month or two. -->

- Studying Computer Engineering at NUS (Class of 2028).
- Working on [Locked-In](/work/#locked-in), an AI-assisted study companion robot built on a Raspberry Pi 5, for NUS Orbital.
- Grinding LeetCode, running and playing chess when I need a break.

More about me [here](/about/), or see things I've built [here](/work/).

## Recent posts

<ul class="list">
{% for post in site.posts limit: 5 %}
  <li>
    <span class="when">{{ post.date | date: '%b %-d, %Y' }}</span>
    <a class="title" href="{{ post.url | relative_url }}">{{ post.title }}</a>
  </li>
{% else %}
  <li class="muted">No posts yet.</li>
{% endfor %}
</ul>
