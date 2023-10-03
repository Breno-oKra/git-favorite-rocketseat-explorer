import { GithubUser } from "./gitHubUser.js";

//classe que contem logica dos dados

export class Favorites {
  // root == #app
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    /* this.entries = [
        {
            login: 'breno-okra',
            name:"Breno Okra",
            public_repos: '178',
            followers:'12450000'
        },
    ] */
  }
  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }
  async add(username) {
    /* esperar isso para continuar */

    try {
      const userExists = this.entries.find((entry) => entry.login === username);
      if (userExists) {
        throw new Error("Usuario já cadastrado");
      }
      const User = await GithubUser.search(username);

      if (User.login === undefined) {
        throw new Error("Usuario não Encontrado!");
      }
      this.entries = [User, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }
  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    // super pega as informção do constructor do favorites que conseguimos com extends
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onadd();
  }
  onadd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }
  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = "Imagem do usuario do github";
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".remove").onclick = () => {
        /* criar um alert com a confirmação de ok ou cancelar */
        const isOk = confirm("Tem Certeza que deseja deletar essa linha");
        if (isOk) {
          this.delete(user);
        }
      };
      this.tbody.append(row);
    });
  }
  createRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td class="user">
    <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
    <a href="https://github.com/maykbrito" target="_blank">
      <p>Mayk Brito</p>
      <span>maykbrito</span>
    </a>
  </td>
  <td class="repositories">
    76
  </td>
  <td class="followers">
    9589
  </td>
  <td>
    <button class="remove">&times;</button>
  </td>
 `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
