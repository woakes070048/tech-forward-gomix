const client = axios.create({});

var $orgsContainer = $('.container--orgs'),
    $toolsContainer = $('.container--tools'),
    $resourcesContainer = $('.container--resources'),
    orgTemplate = Handlebars.compile($('#org-template').html()),
    toolTemplate = Handlebars.compile($('#tool-template').html()),
    resourceTemplate = Handlebars.compile($('#resource-template').html())

client.get('data/orgs.json')
    .then(response => {
        $orgsContainer.html('')
        response.data.forEach(org => {
            $orgsContainer.append(orgTemplate(decorateOrg(org)))
        })
    })

client.get('data/tools.json')
    .then(response => {
        $toolsContainer.html('')
        response.data.forEach(tool => {
            $toolsContainer.append(toolTemplate(decorateTool(tool)))
        })
    })

client.get('data/resources.json')
    .then(response => {
        $resourcesContainer.html('')
        response.data.forEach(resource => {
            $resourcesContainer.append(resourceTemplate(decorateResource(resource)))
        })
    })

// @todo: Move this decoration to the backend! This is leftover from when data was stored in JSON locally
function baseDecorate(item)
{
  item.slug = slugify(item.name)
  item.imageNum = padToTwo(getRandomInt(1, 9))
  item.styleNum = item.customImage ? 9999 : getRandomInt(1, 6)
  
  return item
}

function decorateOrg(org)
{
  baseDecorate(org)
  org.location = buildLocationString(org);

  return org
}

function decorateTool(tool)
{
  return baseDecorate(tool)
}

function decorateResource(resource)
{
  return baseDecorate(resource)
}

function buildLocationString(org)
{
  if (org.locationAddress && org.locationCity && org.locationState) {
    return org.locationAddress + ', ' + org.locationCity + ', ' + org.locationState
  }

  if (org.locationCity && org.locationState) {
    return org.locationCity + ', ' + org.locationState
  }

  if (org.locationState) {
    return org.locationState
  }

  return null
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function padToTwo(number) {
  if (number <= 10) number = ("0" + number).slice(-2)
  return number
}

function slugify(string)
{
  return string.toString().toLowerCase().trim()
    .replace(/&/g, '-and-')         // Replace & with 'and'
    .replace(/[\s\W-]+/g, '-')      // Replace spaces, non-word characters and dashes with a single dash (-)
}
