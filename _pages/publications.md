---
title: "Allan Lab - Publications"
layout: gridlay
excerpt: "Allan Lab -- Publications."
sitemap: false
permalink: /publications/
---


# Publications

## Group highlights

(For a full list see [below](#full-list))

{% assign number_printed = 0 %}
{% for pub in site.publications %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if pub.highlight == 1 %}

{% if even_odd == 0 %}
<div class="row">
{% endif %}

<div class="col-sm-6 clearfix">
 <div class="well">
  <pubtit>{{ pub.title }}</pubtit>
  <img src="{{ site.url }}{{ site.baseurl }}/resources/thumbnails/{{ pub.thumbnail }}" class="img-responsive" width="25%" style="float: left" />
  <p>{{ pub.description }}</p>
  <p><em>{{ pub.authors }}</em></p>
  {% if pub.pdf %}
  <a href="{{ site.url }}{{ site.baseurl }}/resources/pubpdfs/{{ pub.pdf }}">[PDF]</a> {% endif %}
 </div>
</div>

{% assign number_printed = number_printed | plus: 1 %}

{% if even_odd == 1 %}
</div>
{% endif %}

{% endif %}
{% endfor %}

{% assign even_odd = number_printed | modulo: 2 %}
{% if even_odd == 1 %}
</div>
{% endif %}

<p> &nbsp; </p>

## Full List

<div class="row">
<div class="col-md-12">
  {% assign sorted_pubs = site.publications | sort: 'year' | reverse %} 
  {% for pub in sorted_pubs %}
  <div class="row">
  <div class="col-md-2 hide-on-small">
  {% if pub.thumbnail %}
  <img src="{{ site.url }}{{ site.baseurl }}/resources/thumbnails/{{ pub.thumbnail }}" alt="..." class="img-thumbnail" width="70%"> {% endif %}
  </div>
  <div class="col-md-10">
  <p><b>{{pub.title}}</b></p>
  <p>{{pub.author}}, {{pub.venue}}, {{pub.year}} {% if pub.pdf %}
  <a href="{{ site.url }}{{ site.baseurl }}/{{ pub.pdf }}">[PDF]</a> {% endif %}
  </p>
  </div>
  <div>
  {% endfor %}
</div>        
</div>
