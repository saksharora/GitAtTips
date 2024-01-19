const apiUrl = 'https://api.github.com/users/';

let currentPage = 1;
let repositoriesPerPage = 10;


function fetchUserProfile(username) {
  fetch(`${apiUrl}${username}`)
    .then(response => response.json())
    .then(user => {
      displayUserProfile(user);
    })
    .catch(error => {
      console.error('Error fetching user profile:', error);
    });
}

// ... (existing JavaScript code) ...

function fetchRepositories() {
  const username = document.getElementById('username').value;
  const repositoriesContainer = document.getElementById('repositories');
  const userProfileContainer = document.getElementById('userProfile');
  const loader = document.getElementById('loader');
  const searchForm = document.getElementById('search-form');

  // Clear previous results
  if (currentPage === 1) {
    repositoriesContainer.innerHTML = '';
    userProfileContainer.innerHTML = '';
  }

  // Show loader
  loader.style.display = 'block';

  // Fetch user profile
  fetchUserProfile(username);

  // Fetch repositories
  fetch(`${apiUrl}${username}/repos?per_page=${repositoriesPerPage}&page=${currentPage}`)
    .then(response => response.json())
    .then(repositories => {
      // Hide loader after fetching repositories
      loader.style.display = 'none';

      // Hide the search form
      searchForm.style.display = 'none';

      // Display repositories as cards
      repositories.forEach(repo => {
        // Fetch languages for each repository
        fetch(repo.languages_url)
          .then(response => response.json())
          .then(languages => {
            repo.languages = Object.keys(languages);
            const card = createRepositoryCard(repo);
            repositoriesContainer.appendChild(card);
          })
          .catch(error => {
            console.error('Error fetching languages:', error);
            const card = createRepositoryCard(repo);
            repositoriesContainer.appendChild(card);
          });
      });
    })
    .catch(error => {
      // Handle error
      console.error('Error fetching repositories:', error);
      // Hide loader in case of an error
      loader.style.display = 'none';
    });
}

// ... (existing JavaScript code) ...


function displayUserProfile(user) {
  const userProfileContainer = document.getElementById('userProfile');
  userProfileContainer.innerHTML = `
    <img src="${user.avatar_url}" alt="${user.login}" class="rounded-circle" style="width: 300px; height: 300px;">
    <div class="user-profile-info">
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || 'No bio available'}</p>
      <p><strong>Location:</strong> ${user.location || 'Not specified'}</p>
      <p>
        <strong>Website:</strong>
        ${user.blog ? `<a href="${user.blog}" target="_blank">${user.blog}</a>` : 'Not specified'}
      </p>
      <p>
        <strong>GitHub Link:</strong>
        <a href="${user.html_url}" target="_blank">${user.html_url}</a>
      </p>
      <a href="${user.html_url}" target="_blank" class="github-icon">
        <i class="fab fa-github"></i>
      </a>

      <div class="card mb-3">
        <div class="card-body">
          <div class="row">
            <div class="col-6">
              <p class="card-text"><strong>Public Repositories:</strong> ${user.public_repos || 0}</p>
              <p class="card-text"><strong>Public Gists:</strong> ${user.public_gists || 0}</p>
            </div>
            <div class="col-6">
              <p class="card-text"><strong>Followers:</strong> ${user.followers}</p>
              <p class="card-text"><strong>Following:</strong> ${user.following}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


function createRepositoryCard(repo) {
  const card = document.createElement('div');
  card.classList.add('col-md-6', 'col-lg-4', 'mb-4');

  const languages = repo.languages || [];

  const languagesHtml = languages.map(language => `<span class="badge badge-secondary">${language}</span>`).join(' ');

  card.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title"><a href="${repo.html_url}" target="_blank">${repo.name}</a></h5>
        <p class="card-text">${repo.description || 'No description available'}</p>
        <p class="card-text"><strong>Languages:</strong> ${languagesHtml}</p>
      </div>
    </div>
  `;

  return card;
}



function loadMore() {
  currentPage++;
  fetchRepositories();
}

function changePageSize() {
  const pageSizeSelect = document.getElementById('pageSize');
  repositoriesPerPage = parseInt(pageSizeSelect.value, 10);
  currentPage = 1; // Reset current page when changing page size
  fetchRepositories();
}
function goHome() {
  currentPage = 1;  // Reset current page
  repositoriesPerPage = 10;  // Reset page size
  const loader = document.getElementById('loader');
  loader.style.display = 'block';  // Show loader
  fetchRepositories();

  // Hide the search results and profile
  const searchForm = document.getElementById('search-form');
  searchForm.style.display = 'block';  // Show the search form again
  const repositoriesContainer = document.getElementById('repositories');
  repositoriesContainer.innerHTML = '';
  const userProfileContainer = document.getElementById('userProfile');
  userProfileContainer.innerHTML = '';
}