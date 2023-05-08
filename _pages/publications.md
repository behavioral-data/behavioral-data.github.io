---
title: "Behavioral Data Science - Publications"
layout: gridlay
excerpt: "Behavioral Data Science -- Publications."
sitemap: false
permalink: /publications/
---
<script>
  $(document).ready(function(e) {
    $('.open-link').click(function(e) {
       var $wrapper = $(this).parent().find('.hider');
	   $wrapper.css('max-height',$wrapper.find('p').height());
       $(this).remove();
    })
});
</script>

# Publications

## Group highlights
(For a full list see [below](#full-list))

{% assign highlights = site.publications | where_exp:"pub","pub.highlight>=1"%} 

<div class="row">

{% for pub in highlights %}

{% if pub.journal %}
  {% assign venue = pub.journal %}
{% elsif pub.booktitle  %}
  {% assign venue = pub.booktitle %}
{% else %}
  {% assign venue = "BLANK" %}
{% endif %}

<div class="col-md-12 clearfix">
<div class="bdata-pub-highlight box-shadow">
<img src="{{ site.url }}{{ site.baseurl }}/resources/thumbnails/{{ pub.thumbnail }}" class="bdata-pub-img-highlight"/>
<div class="bdata-pub-body">
<div class="bdata-pub-title-highlight">
{{ pub.title }}
</div>
<p><em>{{ pub.author }}
</em>
<br>{{venue}} {{ pub.year}}
{% if pub.award %}
<span class="award">🏆 {{ pub.award }}</span>
{% endif %}
</p>  
<p class="bdata-pub-subtitle-highlight">{{ pub.description }} </p>
<p>
  {% if pub.pdf %}<a href="{{ site.url }}{{ site.baseurl }}/resources/pubpdfs/{{ pub.pdf }}">[PDF]</a> {% endif %}{% if pub.code %}<a href="{{ pub.code }}">[CODE]</a> {% endif %}
</p>
</div>
</div>
</div>

{% endfor %}

</div>

## Full List

<div class="row">
{% assign sorted_pubs = site.publications | sort: 'year' | reverse %}
{% for pub in sorted_pubs %}


{% if pub.journal %}
  {% assign venue = pub.journal %}
{% elsif pub.booktitle  %}
  {% assign venue = pub.booktitle %}
{% else %}
  {% assign venue = "BLANK" %}
{% endif %}


<div class="col-md-12 clearfix">
<div class="bdata-pub box-shadow">
<img src="{{ site.url }}{{ site.baseurl }}/resources/thumbnails/{{ pub.thumbnail }}" class="bdata-pub-img"/>
<div class="bdata-pub-body">
<div class="bdata-pub-title">
{{ pub.title }}
</div>
<p><em>{{ pub.author }}</em>
<br>{{venue}} {{ pub.year}}
{% if pub.award %}
<span class="award">🏆 {{ pub.award }}</span>
{% endif %}

</p> 

{% if pub.pdf %}
<a href="{{ site.url }}{{ site.baseurl }}/resources/pubpdfs/{{ pub.pdf }}">[PDF]</a> 
{% endif %}
</div>
</div>
</div>

{% endfor %}

</div>
