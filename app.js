const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: "",
    carrinho: [],
    alerta: "Item adicionado",
    alertaAtivo: false,
    carrinhoAtivo: false,
  },

  filters: {
    numeroPreco(param) {
      return param.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
    },
  },

  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho) {
        total = this.carrinho.reduce(
          (acumulador, item) => acumulador + item.preco,
          0
        );
      }
      return total;
    },
  },

  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then((r) => r.json())
        .then((json) => {
          this.produtos = json;
        });
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((r) => r.json())
        .then((json) => {
          this.produto = json;
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
    },
    avisoAlerta(msg) {
      this.alerta = msg;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500);
    },
    adicionarItem() {
      this.produto.estoque--;
      const { id, nome, preco } = this.produto;
      this.carrinho.push({ id, nome, preco });
      this.avisoAlerta(`${nome} adicionado ao carrinho`);
    },
    removerItem(param) {
      this.carrinho.splice(param, 1);
    },
    compararEstoque() {
      const itens = this.carrinho.filter(({ id }) => id === this.produto.id);
      this.produto.estoque -= itens.length;
    },
    fecharModal(e) {
      if (e.target == e.currentTarget) this.produto = false;
    },
    fecharCarrinho(e) {
      if (e.target == e.currentTarget) this.carrinhoAtivo = false;
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    router() {
      const hash = window.location.hash;
      if (hash) this.fetchProduto(hash.replace("#", ""));
    },
  },

  watch: {
    produto() {
      document.title = this.produto.nome || "TECNO";
      history.pushState(null, null, `#${this.produto.id || ""}`);
      if (this.produto) this.compararEstoque();
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
  },

  created() {
    this.fetchProdutos();
    this.checarLocalStorage();
    this.router();
  },
});
