function fetchUserInfo(username) {
  const url = `https://api.github.com/users/${username}`;
  $.ajax({
    url: url,
    method: "GET",
    success: function (data) {
        setViewValues(data);
    },
    error: function (xhr, status, error) {
      console.log(`Request failed with status code ${xhr.status}: ${error}`);
    },
  });
}

function fetchRepositories(username) {
  const url = `https://api.github.com/users/${username}/repos`;

  $.ajax({
    url: url,
    method: "GET",
    success: function (repositories) {
      console.log(`Repositories for ${username}:`);
      repositories.forEach((repo) => {
        console.log(repo.name);
      });
      return repositories;
    },
    error: function (xhr, status, error) {
      console.log(`Request failed with status code ${xhr.status}: ${error}`);
    },
  });
}

function setViewValues(userInfo){
    document.getElementById("repoCount").innerHTML = userInfo.public_repos;
    document.getElementById("followerCount").innerHTML = userInfo.followers;
    document.getElementById("followingCount").innerHTML = userInfo.following;
    document.getElementById("company").innerHTML = userInfo.company;
    document.getElementById("location").innerHTML = userInfo.location;
    document.getElementById("email").innerHTML = "ayxanx17@gmail.com";
    document.getElementById("email").href = "ayxanx17@gmail.com";
    document.getElementById("blog").innerHTML = userInfo.blog;
    document.getElementById("blog").href = userInfo.blog;
    document.getElementById("name").innerHTML = userInfo.name;

}

const username = "Drongo-J";
fetchUserInfo(username);

var repositories = fetchRepositories(username);