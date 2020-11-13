let repoBox = document.querySelector('.repo-box');
const starSVG = `
<svg aria-label="star" class="svg-3" viewBox="0 0 16 16" version="1.1" width="11" height="11" role="img">
<path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
</path>
</svg>
`;

const starSVG2 = `
<svg aria-label="star" class="svg-3" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img">
<path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z">
</path>
</svg>
`;

const forkSVG = `
<svg aria-label="fork" class="svg-3" viewBox="0 0 16 16" version="1.1" width="11" height="11" role="img">
<path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z">
</path>
</svg>
`

// Detect when "/" is pressed, and focus on search field
document.onkeypress = function(evt) {
    evt = evt || window.event;
    const charCode = evt.keyCode || evt.which;
    const charStr = String.fromCharCode(charCode);
    if (charStr == "/") {
      document.querySelector(".input-1").focus();
    }
};

// Display mobile menu panel on click of button
function displayMobileMenuBody() {
  let x = document.querySelector(".nav-mobile-body")
  
  if (x.style.display === "none" || x.style.display=="") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

// Check if value give is null, and return empty
function isNull(val) {
  return val || ""
}

// Time formatter
function formatTime(time) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date(time)
  return d.getDate()+' '+months[d.getMonth()].substr(0, 3);
}

// Set the fetched data gotten from GraphQL
function setTemplate(result) {
  const repoBoxChild = document.createElement('div');
  repoBoxChild.className = "repo-box-child";
  repoBoxChild.innerHTML = `
    <div class="repo-name">
      <a href="${result.url}">
        ${result.name}
      </a>

      <button>
        ${starSVG2} Star
      </button>
    </div>

    <div class="repo-bottom">
      <div class="repo-lang">
        <div class="repo-color" style="background: ${result.primaryLanguage.color};color: ${result.primaryLanguage.color}"></div>
        ${result.primaryLanguage.name}
      </div>

      <div class="repo-stars">
        ${starSVG} ${result.stargazerCount}
      </div>

      <div class="repo-fork">
        ${forkSVG} ${result.forkCount}
      </div>

      <div class="repo-update">
        Updated on ${  formatTime(result.updatedAt)}
      </div>
    </div>
  `
  repoBox.prepend(repoBoxChild);
}

// GraphQL fetch query
const fetchQuery = `{
  user(login: "kingkenway") {
    avatarUrl
    bio
    name
    id
    login
    repositories(last: 20, orderBy: {field: UPDATED_AT, direction: DESC}, isFork: true, privacy: PUBLIC) {
      edges {
        node {
          id
          name
          stargazerCount
          updatedAt
          forkCount
          url
          primaryLanguage {
            name
            color
            id
          }
        }
      }
      totalCount
    }
  }
}

`

// GraphQL query parameters and headers
const options = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "bearer 7fb1fbb6cbddb0ce41d35914f9baf8e11ecc6d66"
    },
    body: JSON.stringify({
      query: fetchQuery
    })
};

// Fetch data for user 
fetch(`https://api.github.com/graphql`, options)
.then(res => res.json())
.then(function (res) {
  console.log(res.data.user)
  document.querySelector(".username").innerHTML = res.data.user.login
  document.querySelector(".nav-user").innerHTML = res.data.user.login
  document.querySelector(".fullname").innerHTML = res.data.user.name
  document.querySelector(".bio").innerHTML = res.data.user.bio
  document.querySelector(".image1").src = res.data.user.avatarUrl
  document.querySelector(".image2").src = res.data.user.avatarUrl
  document.querySelector(".image3").src = res.data.user.avatarUrl

  res.data.user.repositories.edges.forEach((repo, index) => {
    result = repo['node'];
    setTemplate(result)
  });
  document.getElementById("repositoriesCount").innerHTML = res.data.user.repositories.totalCount
  document.getElementById("repositoriesCount2").innerHTML = res.data.user.repositories.totalCount
})
