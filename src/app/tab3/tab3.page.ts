import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  searchTerm: string = '';
  recentSearches: string[] = [];
  searchResults: any[] = [];
  filteredProducts: any[] = [];
  lists: any[] = [];
  showGrid: boolean = false;
  isModalOpen: boolean = false;
  selectedProduct: any = null;
  selectedList: string = '';

  constructor(
    private http: HttpClient,
    private listService: ListService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadLists();
  }

  async loadLists() {
    this.lists = await this.listService.getLists();
  }

  filterItems(event: any) {
    const searchTerm = this.normalizeString(event.target.value.toLowerCase());

    if (searchTerm && searchTerm.trim() !== '') {
      this.http.get<any[]>('assets/produtos.json').subscribe((data: any[]) => {
        // Normalize os nomes dos produtos para comparação
        const normalizedData = data.map(item => ({
          ...item,
          normalizedName: this.normalizeString(item.name.toLowerCase())
        }));

        // Primeiro, encontre itens que começam com o termo de pesquisa
        let startsWith = normalizedData.filter((item: any) =>
          item.normalizedName.startsWith(searchTerm)
        );

        // Em seguida, encontre itens que contêm o termo de pesquisa, mas não começam com ele
        let contains = normalizedData.filter((item: any) =>
          item.normalizedName.includes(searchTerm) &&
          !item.normalizedName.startsWith(searchTerm)
        );

        // Combine os dois arrays, com os itens que começam com o termo primeiro
        this.searchResults = startsWith.concat(contains).slice(0, 5);
      });

      // Redefine o estado do produto selecionado e a exibição da grade
      this.selectedProduct = null;
      this.showGrid = false;
    } else {
      this.searchResults = [];
      this.showGrid = false;
    }
  }

  normalizeString(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  selectItem(item: any) {
    this.searchTerm = item.name;
    this.searchResults = [];
    this.showGrid = true;

    this.http.get<any[]>('assets/produtos.json').subscribe((data: any[]) => {
      this.filteredProducts = data.filter((product: any) =>
        this.normalizeString(product.name.toLowerCase()).includes(this.normalizeString(this.searchTerm.toLowerCase()))
      );
    });
  }

  async showProductDetails(product: any) {
    this.selectedProduct = product;
    this.lists = await this.listService.getLists();
    this.isModalOpen = true;
  }

  async addProductToList() {
    if (this.selectedList && this.selectedProduct) {
      await this.listService.addItemToList(this.selectedList, {
        name: this.selectedProduct.name,
        preco: this.selectedProduct.preco, // Adiciona o preço do produto
        quantity: 1, // Adiciona quantidade padrão
      });
      this.isModalOpen = false;
    }
  }

  closeModal() {
    this.isModalOpen = false;
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchResults = [];
    this.filteredProducts = [];
    this.showGrid = false;
    this.selectedProduct = null;
  }
}
