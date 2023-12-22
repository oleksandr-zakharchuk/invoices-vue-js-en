<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import axios from 'axios'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'
export default {
  name: 'app',
  components: { VueDatePicker },
  data() {
    return {
      date: null,
      heading: "",
      income: ""
    };
  },
  methods: {
    async generatePDF() {
      if (this.date == null) {
        this.$refs.dateObj.openMenu();
        return
      }
      const format = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();

        return `${year}-${month}-${day} ${hours}:${minutes}`;
      }

      let start_date = format(this.date[0])
      let end_date = format(this.date[1])
      let pdf_data = await axios.get(axios.defaults.baseURL + '/generate_pdf', {
        params: {
          start_date: start_date,
          end_date: end_date,
        }
      });

      this.heading = `Report for period from ${start_date} to ${end_date}`
      let transfer_price_sum = 0
      if (pdf_data.data.json_list.transfer_price_sum !== null) {
        transfer_price_sum = pdf_data.data.json_list.transfer_price_sum.toString()
      }
      this.income = `Income for period: ` + transfer_price_sum
      const columns = [
        { title: "Invoice type", dataKey: "invoice_type" },
        { title: "Quantity", dataKey: "quantity" },
        { title: "Batch", dataKey: "batch_id" },
        { title: "Product name", dataKey: "product_name" },
        { title: "Price", dataKey: "price" },
        { title: "Date", dataKey: "date" },
      ];
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "in",
        format: "letter"
      });
      // text is placed using x, y coordinates
      doc.setFontSize(16).text(this.heading, 0.5, 1.0);
      // create a line under heading 
      doc.setLineWidth(0.01).line(0.5, 1.1, 8.0, 1.1);
      doc
      .setFont("helvetica")
      .setFontSize(12)
      .text(this.income, 0.5, 1.5, { align: "left", maxWidth: "7.5" });
      doc.setFontSize(16).text("Sale of goods for the period", 0.5, 1.90);
      doc.autoTable({
        columns,
        body: pdf_data.data.json_list['transfer'],
        margin: { left: 0.5, top: 2.0 }
      });
      doc.setFontSize(16).text("Product balances at the end of the period", 0.5, doc.lastAutoTable.finalY + 0.3);
      doc.autoTable({
        startY: doc.autoTable.previous.finalY + 0.4,
        columns,
        body: pdf_data.data.json_list['receipt'],
        margin: { left: 0.5, top: 2.0 }
      });
      doc
        .save(`${this.heading}.pdf`);
    },
    computed: {
      console: () => console,
      window: () => window,
    }
  }
}
</script>

<template>
<div class="container">
  <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
    <router-link  to="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
      <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
      <span class="fs-4">Invoices</span>
    </router-link>

    <ul id="header-menu" class="nav nav-pills">
      <li class="nav-item"><router-link  to="/" class="nav-link active">Home Page</router-link></li>
      <li id="datepicker-widget" class="nav-item"><VueDatePicker ref="dateObj" v-model="date" range ></VueDatePicker></li>
      <li class="nav-item"><button class="nav-link active" v-on:click="generatePDF()">Generate PDF Report</button></li>
    </ul>
  </header>
</div>
<router-view />
</template>

<style scoped>
  #header-menu > li {
    padding-left:15px;
  }
  #datepicker-widget {
    min-width: 360px;
  }
  #clear_invoices {
    margin-left:15px;
  }
</style>
