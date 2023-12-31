<script>
import axios from 'axios'
export default {
  name: "InvoiceForm",
  data() {
    return {
      product_list: null,
      products: [{
        id: '',
        qty: ''
      }],
      invoice_type: 'receipt',
      val_err: [],
      sub_err: [],
      sub_out_of_stock: false,
      sub_out_of_stock_product_name: null,
      res_code: '',
      batch_id: null
    }
  },
  async created() {
    this.product_list = await axios.get(axios.defaults.baseURL + '/create');
  },
  methods: {
    add(index) {
      this.products.push({
        id: '',
        qty: ''
      })
    },
    remove(index) {
      this.products.splice(index, 1)
    },
    submitForm() {
        this.checkForm()
        if (this.val_err.length != 0) {
            return
        }

        this.sub_err = [];

        let formData = {
            products: this.products,
            invoice_type: this.invoice_type
        };

        axios.post(axios.defaults.baseURL + "/create", formData)
            .then(response => {
                if (response.data.status == 'success') {
                    this.batch_id = response.data.batch_id
                    this.$router.push({
                        name: 'InvoiceFormView', 
                        params: {
                            invoice_created: 'invoice_created',
                            batch_id: this.batch_id
                        }
                    });
                } else if (response.data.status == 'out_of_stock') {
                    this.sub_out_of_stock = true
                    Object.keys(this.product_list.data.json_list).forEach((key) => {
                        if (this.product_list.data.json_list[key].id == response.data.product_id) {
                            this.sub_out_of_stock_product_name = this.product_list.data.json_list[key].product_name
                        }
                    });
                }
            })
            .catch(error => {
                this.sub_err.push(error.message);
                console.error("An error occurred: ", error);
            }
        );  
    },
    checkForm: function (e) {
        this.val_err = [];

        this.products.forEach((e, index) => {
            if (e.id == '') {
                this.val_err.push('Select a product in ' + (index+1) + ' item.');
            }
            if (e.qty == '') {
                this.val_err.push('Enter product quantity in ' + (index+1) + ' item.');
            }
            if (e.qty <= 0) {
                this.val_err.push('Quantity of product in ' + (index+1) + ' item must be greater than zero.');
            }
        });
    }
  },
  computed: {
    console: () => console,
    window: () => window,
  }
}
</script>

<template>
<div class="container">
  <main>
    <div class="row g-5">
      <div class="col-md-7 col-lg-8 form">
        <h4 class="mb-3">Invoice</h4>
        <p v-if="sub_out_of_stock">
            <ul class="list-group">
                <li class="list-group-item list-group-item-danger">Product "{{ sub_out_of_stock_product_name }}" out of stock</li>
            </ul>
        </p>
        <p v-if="sub_err.length">
            <ul class="list-group">
                <li class="list-group-item list-group-item-danger">Error(s) occurred when form submitting:</li>
                <li class="list-group-item list-group-item-warning" v-for="error in sub_err">{{ error }}</li>
            </ul>
        </p>
        <p v-if="val_err.length">
            <ul class="list-group">
                <li class="list-group-item list-group-item-danger">Correct the following error(s):</li>
                <li class="list-group-item list-group-item-warning" v-for="error in val_err">{{ error }}</li>
            </ul>
        </p>
        <form class="needs-validation" novalidate="" @submit="checkForm" method="post">
          <div class="row g-3 form-field" v-for="(product, k) in products" :key="k">

            <div class="col-md-5">
              <label for="product" class="form-label">Product</label>
              <select class="form-select" id="product" :required="true" v-model="product.id">
                <option 
                v-for="p in product_list.data.json_list" 
                v-bind:value="p.id"
                >{{ p.product_name }}</option>
              </select>
              <div class="invalid-feedback">
                Please select a product
              </div>
            </div>

            <div class="col-md-3">
              <label class="form-label" for="qty">Quantity</label>
              <input min="1" max="100000" type="number" id="qty" class="form-control" :required="true" v-model.number="product.qty" />
              <div class="invalid-feedback">
                Please enter quantity
              </div>
            </div>

            <div class="col-md-3 d-flex">
              <i class="fas fa-minus-circle mt-auto" @click="remove(k)" v-show="k || (!k && products.length > 1)">
                <button class="btn btn-danger rounded-pill px-3" type="button">Remove</button>
              </i>
              <i class="fas fa-plus-circle mt-auto" @click="add(k)" v-show="k == products.length-1">
                <button class="btn btn-success rounded-pill px-3" type="button">Add field</button>
              </i>
            </div>

          </div>

          <hr class="my-4">

          <h4 class="mb-3">Invoice type</h4>

          <div class="my-3">
            <div class="form-check">
              <input id="credit" name="invoice_type" type="radio" value="receipt" class="form-check-input" checked="" required="" v-model="invoice_type">
              <label class="form-check-label" for="credit">Receipt invoice</label>
            </div>
            <div class="form-check">
              <input id="debit" name="invoice_type" type="radio" value="transfer" class="form-check-input" required="" v-model="invoice_type">
              <label class="form-check-label" for="debit">Transfer invoice</label>
            </div>
          </div>

          <hr class="my-4">

          <button class="w-100 btn btn-primary btn-lg" type="submit" @click.stop.prevent="submitForm()">Create Invoice</button>
        </form>
        <router-link  to="/">
            <button class="w-100 btn  btn-lg">Back to list</button>
        </router-link>
      </div>
    </div>
  </main>
</div>
</template>

<style scoped>
  .form-field {
    margin-top: 0px;
  }
  .form {
    margin-top: 80px;
  }
</style>
