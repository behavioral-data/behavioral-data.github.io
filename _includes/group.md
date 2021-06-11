# Our Group

<!-- **We are  looking for new PhD students, Postdocs, and Master students to join the team** [(see openings)]({{ site.url }}{{ site.baseurl }}/vacancies) **!**

## Members -->

<div class="row">

{% assign sorted_people = site.people | sort: 'priority' | where:"is_visiting","false"%}
{% for member in sorted_people %}

<div class="col-sm-3 col-xs-6 clearfix">
<div class="bdata-member">
<img src= "{{ site.url }}{{ site.baseurl }}/{{site.RESOURCES_PATH}}/headshots/{{member.headshot}}" class="img-responsive bdata-img-headshot">

#### [{{ member.name }}]({{member.site}})

<i>{{ member.title }}</i>

</div>

</div>

{% endfor %}

</div>

## Current Visitors

<div class="row">
{% assign sorted_people = site.people | sort: 'priority' | where:"is_visiting","true"%}
{% for member in sorted_people %}
<div class="col-sm-3 col-xs-6 clearfix">
<div class="bdata-member">
<img src= "{{ site.url }}{{ site.baseurl }}/{{site.RESOURCES_PATH}}/headshots/{{member.headshot}}" class="img-responsive bdata-img-headshot">

#### [{{ member.name }}]({{member.site}})

<i>{{ member.title }}</i>

</div>

</div>

{% endfor %}

</div>

## Alumni

<ul>
{% for person in site.data.alumni %}
<li><a href="{{ person.site }}" >{{ person.name }}</a></li>
{% endfor %}
</ul>