# Our Group

<!-- **We are  looking for new PhD students, Postdocs, and Master students to join the team** [(see openings)]({{ site.url }}{{ site.baseurl }}/vacancies) **!**

## Members -->

<div class="row">

{% assign sorted_people = site.people | sort: 'priority' | where:"is_visiting","false" | where: 'inactive', nil%}
{% for member in sorted_people %}
{% unless member.inactive %}
<div class="col-sm-4 col-xs-6 clearfix">
<div class="bdata-member">
<img src= "{{ site.url }}{{ site.baseurl }}/{{site.RESOURCES_PATH}}/headshots/{{member.headshot}}" class="img-responsive bdata-img-headshot">

#### [{{ member.name }}]({{member.site}})

<i>{{ member.title }}</i>

</div>

</div>
{% endunless %}
{% endfor %}

</div>

{% assign sorted_visitors = site.people | sort: 'priority' | where:"is_visiting","true" | where: 'inactive', nil%}
{% if sorted_vistors %}
## Current Visitors
<div class="row">

{% for member in sorted_visitors %}

<div class="col-sm-4 col-xs-6 clearfix">
<div class="bdata-member">
<img src= "{{ site.url }}{{ site.baseurl }}/{{site.RESOURCES_PATH}}/headshots/{{member.headshot}}" class="img-responsive bdata-img-headshot">

#### [{{ member.name }}]({{member.site}})

<i>{{ member.title }}</i>

</div>
</div>
{% endfor %}

</div>
{% endif %}
## Alumni

<ul>
{% for person in site.data.alumni %}
<li><a href="{{ person.site }}" >{{ person.name }}</a></li>
{% endfor %}
</ul>