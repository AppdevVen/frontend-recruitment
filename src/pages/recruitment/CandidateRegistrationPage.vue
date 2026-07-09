<template>
  <div v-if="!periodOpen && !loadingPeriod" style="display:flex;flex-direction:column;min-height:100vh;">
    <div style="position:fixed;right:5%;top:0"><img src="/images/dbc-blue.png" style="max-height:150px" /></div>
    <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
      <img class="img-responsive" src="/images/thankyou.png" style="vertical-align:middle;max-height:200px" />
      <div style="font-family:Arial,Helvetica,sans-serif;font-weight:700;text-transform:uppercase;font-size:22px;line-height:1.6;letter-spacing:1px;color:#000;margin:30px 0;">
        <p>MANAGEMENT TRAINEE DBC REGISTRATION IS</p>
        <p>OFFICIALLY CLOSED</p>
      </div>
    </div>
    <div style="width:100%;padding:16px;margin-top:auto;"><img src="/images/footer-dbc-group.png" style="width:100%" /></div>
  </div>
  <div v-else-if="periodOpen" class="container-fluid">
    <div class="page-header">
      <div class="row">
        <div class="col-sm-3"><center><img src="/images/dbc-blue.png" style="max-width:70%" /></center></div>
        <div class="col-sm-9"><br><p style="font-weight:bold;text-align:center;margin-bottom:-1px;">DBC</p>
          <p style="text-align:center;">Group Market Leader of Building Materials Industry with leading brands in Indonesia<br>Provides an opportunity for superior individuals to join us.</p></div>
      </div>
    </div>
    <div style="border:1px solid rgb(247,62,31);padding:16px;">
      <form @submit.prevent="onSubmit">
        <div class="row"><div class="col-sm-12">
          <table border="0" style="margin-bottom: 10px;"><tr><td width="20%">Position<span class="star">*</span></td><td>:</td><td width="80%"><select v-model="form.position" required style="width:100%;"><option value="MT" selected>Management Trainee</option></select></td></tr></table>
          <table width="784" align="center" class="table table-bordered priority-table"><tbody>
            <tr><th>Priority 1</th><th>Priority 2</th><th>Priority 3</th><th>Others</th></tr>
            <tr>
              <td align="center"><select v-model="form.priority_1" required><option value=""></option><option v-for="p in priorities" :key="'p1'+p.alias_prioritas" :value="p.alias_prioritas">{{p.desc_prioritas}}</option></select></td>
              <td align="center"><select v-model="form.priority_2" required><option value=""></option><option v-for="p in priorities" :key="'p2'+p.alias_prioritas" :value="p.alias_prioritas">{{p.desc_prioritas}}</option></select></td>
              <td align="center"><select v-model="form.priority_3" required><option value=""></option><option v-for="p in priorities" :key="'p3'+p.alias_prioritas" :value="p.alias_prioritas">{{p.desc_prioritas}}</option></select></td>
              <td align="center"><input v-model="form.others" class="form-control" type="text"></td>
            </tr>
          </tbody></table>
        </div></div>
        <div class="row"><div class="col-sm-12"><table border="1" align="center" class="table table-bordered"><tbody><tr><td align="center" class="personal"><strong>PERSONAL DATA</strong></td></tr></tbody></table></div></div>
        <div class="row"><div class="col-sm-12"><div class="table-responsive"><table class="table" border="0" align="center">
          <tr><td>KTP Number <span class="star">*</span></td><td>:</td><td><input type="text" v-model="form.id_num" class="form-control" maxlength="16" required></td><td></td><td></td><td></td><td></td><td></td></tr>
          <tr><td>Name <span class="star">*</span></td><td>:</td><td colspan="3"><input type="text" v-model="form.name" class="form-control" required></td><td>Gender <span class="star">*</span></td><td>:</td><td style="vertical-align: center;"><input type="radio" v-model="form.gender" value="M" id="g1"><label for="g1">Male</label>&nbsp;&nbsp;<input type="radio" v-model="form.gender" value="F" id="g2"><label for="g2">Female</label></td></tr>
          <tr><td>Place / Date of Birth <span class="star">*</span></td><td>:</td><td colspan="2"><input type="text" v-model="form.place" class="form-control" required></td><td><input type="date" v-model="form.dob" @change="calcAge" style="text-align:center"></td><td>Age</td><td>:</td><td><input type="text" v-model="form.age" class="form-control" readonly></td></tr>
          <tr><td>Address <span class="star">*</span></td><td>:</td><td colspan="6"><textarea v-model="form.address" class="form-control" rows="3" required></textarea></td></tr>
          <tr><td>Telephone</td><td>:</td><td colspan="3" style="padding:0"><table><tr><td width="30%" style="border:0"><input type="text" v-model="form.telp1" class="form-control" maxlength="3"></td><td style="border:0"><input type="text" v-model="form.telp2" class="form-control" maxlength="12"></td></tr></table></td><td>Handphone <span class="star">*</span></td><td>:</td><td><input type="text" v-model="form.phone" class="form-control" maxlength="13"></td></tr>
          <tr><td>Email <span class="star">*</span></td><td>:</td><td colspan="6"><input type="email" v-model="form.email" class="form-control" required></td></tr>
          <tr><td>Source of Information <span class="star">*</span></td><td>:</td><td colspan="3"><select v-model="form.source" required><option value=""></option><option value="Campus Hiring">Campus Hiring</option><option value="Jobstreet">Jobstreet</option><option value="Head Hunter">Head Hunter</option><option value="LinkedIn">LinkedIn</option><option value="Referensi">Referensi</option><option value="Others">Others</option></select></td><td></td><td></td></tr>
          <tr><td>Marital Status <span class="star">*</span></td><td>:</td><td colspan="3"><input type="radio" v-model="form.status" value="S" id="s1" required><label for="s1">Single</label>&nbsp;&nbsp;<input type="radio" v-model="form.status" value="M" id="s2"><label for="s2">Married</label></td><td></td><td></td></tr>
          <tr><td>Upload CV</td><td>:</td><td><input type="file" ref="fileRef" accept=".pdf,.doc,.docx" @change="onFile"></td><td></td><td></td><td></td><td></td><td></td></tr>
        </table></div></div></div>
        <div class="row"><div class="col-sm-12"><table border="1" align="center" class="table table-bordered"><tbody><tr><td align="center" class="personal"><strong>LAST FORMAL EDUCATION</strong></td></tr></tbody></table></div></div>
        <div class="row"><div class="col-sm-12"><div class="table-responsive"><table align="center" class="table table-bordered"><tbody>
          <tr><th colspan="7" style="text-align:center">Education 1</th></tr>
          <tr><th>Type</th><th>School Name</th><th>Degree</th><th>Major</th><th>Start</th><th>End</th><th>GPA</th></tr>
          <tr><td><select v-model="form.edu_major1"><option value=""></option><option value="University">University</option><option value="Academy">Academy</option><option value="High School">High School</option></select></td><td><input v-model="form.edu_school1" class="form-control"></td><td><select v-model="form.edu_degree1"><option value=""></option><option value="S1">S1</option><option value="S2">S2</option><option value="D3">D3</option></select></td><td><input v-model="form.edu_jurusan1" class="form-control"></td><td><input v-model="form.edu_start1" class="form-control" maxlength="4" style="text-align:center"></td><td><input v-model="form.edu_end1" class="form-control" maxlength="4" style="text-align:center"></td><td><input v-model="form.edu_gpa1" class="form-control" maxlength="5" style="text-align:center"></td></tr>
          <tr><th colspan="7" style="text-align:center">Education 2</th></tr>
          <tr><th>Type</th><th>School Name</th><th>Degree</th><th>Major</th><th>Start</th><th>End</th><th>GPA</th></tr>
          <tr><td><select v-model="form.edu_major2"><option value=""></option><option value="University">University</option><option value="Academy">Academy</option><option value="High School">High School</option></select></td><td><input v-model="form.edu_school2" class="form-control"></td><td><select v-model="form.edu_degree2"><option value=""></option><option value="S1">S1</option><option value="S2">S2</option><option value="D3">D3</option></select></td><td><input v-model="form.edu_jurusan2" class="form-control"></td><td><input v-model="form.edu_start2" class="form-control" maxlength="4" style="text-align:center"></td><td><input v-model="form.edu_end2" class="form-control" maxlength="4" style="text-align:center"></td><td><input v-model="form.edu_gpa2" class="form-control" maxlength="5" style="text-align:center"></td></tr>
        </tbody></table></div></div></div>
        <div class="row"><div class="col-sm-12"><table border="1" align="center" class="table table-bordered"><tbody><tr><td align="center" class="personal"><strong>LAST WORKING EXPERIENCE</strong></td></tr></tbody></table></div></div>
        <div class="row"><div class="col-sm-12"><div class="table-responsive"><table width="784" align="center" class="table table-bordered"><tbody>
          <tr><th>Company Name</th><th>Position</th><th>Start (Year)</th><th>End (Year)</th></tr>
          <tr><td><input v-model="form.exp_pt" class="form-control"></td><td><input v-model="form.exp_posisi" class="form-control"></td><td><input v-model="form.exp_start" class="form-control" maxlength="4" style="text-align:center"></td><td><input v-model="form.exp_end" class="form-control" maxlength="4" style="text-align:center"></td></tr>
        </tbody></table></div></div></div>
        <div class="row"><div class="col-sm-12"><table border="0" align="center"><tbody><tr><td align="center"><center><input type="checkbox" v-model="disclaimer"> I hereby declare that the information I provided above is true. In the event of any unlawfulness, I shall be solely responsible for all consequences in accordance with the terms of the Company, including termination of employment without conditions or other legal action.<br><br><button type="button" class="btn btn-primary" @click="resetForm">Reset</button> <button type="submit" class="btn btn-primary" :disabled="!disclaimer||submitting">Submit</button></center></td></tr><tr><td><p><span class="star">*</span> please complete the requirement information</p></td></tr></tbody></table></div></div>
      </form>
    </div>
    <div class="row"><div class="col-sm-12"><div style="width:100%;margin-top:20px"><img src="/images/logo1.jpeg" style="width:100%" /></div></div></div>
  </div>
  <div v-else style="display:flex;justify-content:center;align-items:center;min-height:100vh"><p>Loading...</p></div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
const periodOpen = ref(false); const loadingPeriod = ref(true); const submitting = ref(false);
const disclaimer = ref(false); const priorities = ref([]); const cvFile = ref(null); const fileRef = ref(null);
const form = reactive({ position:'MT', id_num:'', name:'', gender:'', place:'', dob:'', age:'', address:'', telp1:'', telp2:'', phone:'', email:'', status:'', source:'', priority_1:'', priority_2:'', priority_3:'', others:'', edu_major1:'', edu_school1:'', edu_degree1:'', edu_jurusan1:'', edu_start1:'', edu_end1:'', edu_gpa1:'', edu_major2:'', edu_school2:'', edu_degree2:'', edu_jurusan2:'', edu_start2:'', edu_end2:'', edu_gpa2:'', exp_pt:'', exp_posisi:'', exp_start:'', exp_end:'' });
const calcAge = () => { if(!form.dob){form.age='';return;} form.age=String(new Date().getFullYear()-new Date(form.dob).getFullYear()); };
const onFile = (e) => { cvFile.value = e.target.files[0]||null; };
const resetForm = () => { Object.keys(form).forEach(k=>{if(k!=='position')form[k]='';}); cvFile.value=null; disclaimer.value=false; if(fileRef.value)fileRef.value.value=''; };
const checkPeriod = async () => { try { const r=await axios.get(`${import.meta.env.VITE_API}recruitment/periods/status`); periodOpen.value=r.data.data.is_open; } catch{periodOpen.value=false;} finally{loadingPeriod.value=false;} };
const loadPriorities = async () => { try { const r=await axios.get(`${import.meta.env.VITE_API}recruitment/priorities?active=1`); priorities.value=r.data.data; } catch{} };
const onSubmit = async () => { if(!disclaimer.value){alert('You must agree the disclaimer first.');return;} if(!form.id_num){alert('KTP number must be filled in');return;} submitting.value=true; try { const fd=new FormData(); Object.entries(form).forEach(([k,v])=>fd.append(k,v||'')); if(cvFile.value)fd.append('file_cv',cvFile.value); await axios.post(`${import.meta.env.VITE_API}recruitment/candidates`,fd,{headers:{'Content-Type':'multipart/form-data'}}); alert('Registration Successful'); resetForm(); } catch(e){ alert(e.response?.data?.message||'Registration Failed'); } finally{submitting.value=false;} };
onMounted(()=>{checkPeriod();loadPriorities();});
</script>

<style scoped>
.star{color:#F00} .personal{background:#f5f5f5;text-align:center} .container-fluid{padding:15px}
.btn-primary{background:#26a69a;border:none;color:#fff;padding:8px 16px;border-radius:2px;cursor:pointer;margin:0 4px}
.btn-primary:hover{background:#2bbbad} .btn-primary:disabled{opacity:.6;cursor:not-allowed}
.form-control{padding:4px 8px;border:1px solid #ccc;border-radius:2px;width:100%;box-sizing:border-box}
select{padding:4px 8px;border:1px solid #ccc;border-radius:2px}
.table{width:100%;margin-bottom:15px} .table th,.table td{padding:8px;vertical-align:middle}
.table-bordered{border:1px solid #ddd} .table-bordered th,.table-bordered td{border:1px solid #ddd}
.table-responsive{overflow-x:auto} textarea{min-height:60px}
.row{display:flex;flex-wrap:wrap;margin:0 -15px} .col-sm-12{flex:0 0 100%;max-width:100%;padding:0 15px}
.col-sm-3{flex:0 0 25%;max-width:25%;padding:0 15px} .col-sm-9{flex:0 0 75%;max-width:75%;padding:0 15px}
.priority-table {width: 100%;}
.priority-table td {width: 25%;text-align: center;}
.priority-table select,.priority-table input {width: 100%;}
</style>
