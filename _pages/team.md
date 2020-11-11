---
title: "Allan Lab - Team"
layout: gridlay
excerpt: "Allan Lab: Team members"
sitemap: false
permalink: /team/
---

# Our Group

**We are  looking for new PhD students, Postdocs, and Master students to join the team** [(see openings)]({{ site.url }}{{ site.baseurl }}/vacancies) **!**

## Members
{% assign number_printed = 0 %}
{% assign sorted_people = site.people | sort: 'priority' | where:"is_visiting","false"%} 
{% for member in sorted_people %}

{% assign even_odd = number_printed | modulo: 2 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
<img src= "{{ site.url }}{{ site.baseurl }}/{{site.RESOURCES_PATH}}/headshots/{{member.headshot}}" class="img-responsive" width="25%" style="float: left" >
#### [{{ member.name }}]({{member.site}})
<i>{{ member.title }}</i>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}

## Current Visitors

{% assign number_printed = 0 %}
{% assign sorted_people = site.people | sort: 'priority' | where:"is_visiting","true"%} 
{% for member in sorted_people %}

{% assign even_odd = number_printed | modulo: 2 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
<img src= "{{ site.url }}{{ site.baseurl }}/{{site.RESOURCES_PATH}}/headshots/{{member.headshot}}" class="img-responsive" width="25%" style="float: left" >
#### [{{ member.name }}]({{member.site}})
<i>{{ member.title }}</i>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}

## Alumni
We don't currently have any! But we could add some using a `.yml` file in the `data` directory.


