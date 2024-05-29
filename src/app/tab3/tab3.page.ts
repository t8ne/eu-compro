import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    private listService: ListService
  ) {}

  ngOnInit() {
    this.loadLists();
  }

  async loadLists() {
    try {
      this.lists = await this.listService.getLists();
      console.log('Lists loaded:', this.lists); // Debugging line to check if lists are loaded
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  }

  filterItems(event: any) {
    const searchTerm = this.normalizeString(event.target.value.toLowerCase());

    if (searchTerm && searchTerm.trim() !== '') {
      this.http.get<any[]>('assets/produtos.json').subscribe((data: any[]) => {
        const normalizedData = data.map(item => ({
          ...item,
          normalizedName: this.normalizeString(item.name.toLowerCase())
        }));

        let startsWith = normalizedData.filter((item: any) =>
          item.normalizedName.startsWith(searchTerm)
        );

        let contains = normalizedData.filter((item: any) =>
          item.normalizedName.includes(searchTerm) &&
          !item.normalizedName.startsWith(searchTerm)
        );

        this.searchResults = startsWith.concat(contains).slice(0, 5);
      });

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
    this.selectedProduct = { ...product, quantity: 1 }; // Default quantity to 1
    await this.loadLists(); // Ensure lists are loaded before showing modal
    this.isModalOpen = true;
  }

  async addProductToList() {
    if (this.selectedList && this.selectedProduct) {
      await this.listService.addItemToList(this.selectedList, {
        name: this.selectedProduct.name,
        preco: this.selectedProduct.preco,
        quantity: this.selectedProduct.quantity,
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

  incrementQuantity() {
    if (this.selectedProduct) {
      this.selectedProduct.quantity++;
    }
  }
  
  decrementQuantity() {
    if (this.selectedProduct && this.selectedProduct.quantity > 1) {
      this.selectedProduct.quantity--;
    }
  }
}
