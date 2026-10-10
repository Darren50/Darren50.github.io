---
layout: page
title: SaveUrFood
heading: SaveUrFood
subtitle: School project · Android Studio, Java, Firebase, SQLite
permalink: /work/saveurfood/
back:
  title: All work
  url: /work/
---

![SaveUrFood logo](/images/SaveUrFoodLogo.jpeg){: .phone}

**Project summary:** Food wastage is a big issue in many countries. In 2011, around one third of the world's food was
lost or wasted. Wasted food puts pressure on resources and waste disposal, adding to our carbon footprint. The best way
to prevent it is to stop it at the source: buy only what you need, and give away what you don't.

Many food-tracking apps never catch on because entering data is tiring. With AI image-to-text and barcode-based adding
and removing, SaveUrFood cuts down that effort for its target users, 25 to 54 year olds who are comfortable with
technology.

**Features:**

- Community section with info on local food banks
- AI image-to-text recognition for easier data input
- Barcode scanner to add and remove items while shopping
- Expiry date calculator

It was my first time using Android Studio, so I learnt through YouTube videos, starting with a splash screen and a
**Firebase** login page.

![SaveUrFood sign-in screen](/images/SaveUrFoodSignIn.jpg){: .phone}

I then stored the user's food in an SQLite database, and added an **expiry date calculator** and **text recognition
with Google Lens** that fills in fields from a photo.

![Add food screen](/images/SaveUrFoodAddFood.jpg){: .phone}

A barcode scanner uses each barcode as an ID, so you can later remove every item with the same barcode at once.

![Barcode scanning screen](/images/SaveUrFoodBarcode.jpg){: .phone}

Finally, a Community section links to various food banks' websites.

![Community section](/images/SaveUrFoodCommunity.jpg){: .phone}

This project was really fun. It was my first taste of app development, and I hope to get even better at it someday!
