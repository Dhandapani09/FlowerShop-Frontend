import React, { createContext, useContext, useMemo, useState } from "react";
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  Flower2, LayoutDashboard, Users, Store, ShoppingCart, ShoppingBag, BookOpen,
  Wallet, LogOut, Menu, Bell, Search, Plus, Download, Languages, Leaf,
  TrendingUp, IndianRupee, Package, CalendarDays, ArrowUpRight, ArrowDownRight,
  Sprout, ChevronDown, CheckCircle2, AlertCircle, X, Pencil, Trash2
} from "lucide-react";
import { seedSuppliers, seedCustomers, flowers, seedLedger } from "./data";
import { API_BASE_URL, DEMO_MODE, api, endpoints } from "./services/api";

const I18N = {
  en: {
    app:"Flower Wholesale", dashboard:"Dashboard", supplier:"Supplier", customer:"Customer",
    purchase:"Purchase Entry", sales:"Sales Entry", ledger:"Ledger", payment:"Payment Receipt",
    logout:"Logout", welcome:"Good morning", overview:"Business overview", purchases:"Today's purchases",
    salesToday:"Today's sales", supplierAdvance:"Supplier advance", customerDue:"Customer receivables",
    supplierLedger:"Supplier advance ledger", recentSales:"Recent sales", stock:"Flower stock",
    quick:"Quick actions", addSupplier:"Add supplier", addCustomer:"Add customer", newPurchase:"New purchase",
    newSale:"New sale", search:"Search...", save:"Save", cancel:"Cancel", name:"Name", phone:"Mobile number",
    address:"Address / Location", type:"Supplier type", shop:"Shop name", creditLimit:"Credit limit",
    advance:"Opening advance", payable:"Payable balance", receivable:"Receivable balance",
    date:"Date", supplierName:"Supplier", customerName:"Customer", flower:"Flower", grade:"Grade",
    quantity:"Quantity", accepted:"Accepted quantity", rejected:"Rejected quantity", rate:"Daily rate",
    amount:"Amount", total:"Total", adjusted:"Advance adjusted", remaining:"Remaining advance",
    additionalPayable:"Additional payable", description:"Description", paymentMode:"Payment mode",
    reference:"Reference number", partyType:"Account type", all:"All", supplierTab:"Supplier ledger",
    customerTab:"Customer ledger", debit:"Debit", credit:"Credit", balance:"Balance",
    recordPayment:"Record supplier payment", recordReceipt:"Record customer receipt",
    loginTitle:"Welcome back", loginSubtitle:"Sign in to manage your flower business",
    username:"Username", password:"Password", signIn:"Sign in", demoHint:"Demo login: admin / admin123",
    invalid:"Please complete the required fields correctly.", saved:"Saved successfully (demo data).",
    noData:"No records found", dashboardSub:"Your wholesale business at a glance",
    language:"தமிழ்", status:"Status", actions:"Actions", edit:"Edit", delete:"Delete",
	purchaseHistory:"Purchase history", saleHistory:"Sales history",
	offline:"Office LAN ready", demo:"DEMO MODE", close:"Close"
  },
  ta: {
    app:"மலர் மொத்த விற்பனை", dashboard:"முகப்பு", supplier:"சப்ளையர்", customer:"வாடிக்கையாளர்",
    purchase:"கொள்முதல் பதிவு", sales:"விற்பனை பதிவு", ledger:"கணக்கு அறிக்கை", payment:"பணம் / ரசீது",
    logout:"வெளியேறு", welcome:"காலை வணக்கம்", overview:"வணிக நிலவரம்", purchases:"இன்றைய கொள்முதல்",
    salesToday:"இன்றைய விற்பனை", supplierAdvance:"சப்ளையர் முன்பணம்", customerDue:"வாடிக்கையாளர் பாக்கி",
    supplierLedger:"சப்ளையர் முன்பண கணக்கு", recentSales:"சமீபத்திய விற்பனை", stock:"மலர் இருப்பு",
    quick:"விரைவு செயல்கள்", addSupplier:"சப்ளையர் சேர்க்க", addCustomer:"வாடிக்கையாளர் சேர்க்க",
    newPurchase:"புதிய கொள்முதல்", newSale:"புதிய விற்பனை", search:"தேடுக...", save:"சேமிக்க",
    cancel:"ரத்து", name:"பெயர்", phone:"கைபேசி எண்", address:"முகவரி / இடம்", type:"சப்ளையர் வகை",
    shop:"கடை பெயர்", creditLimit:"கடன் வரம்பு", advance:"தொடக்க முன்பணம்", payable:"செலுத்த வேண்டியது",
    receivable:"பெற வேண்டியது", date:"தேதி", supplierName:"சப்ளையர்", customerName:"வாடிக்கையாளர்",
    flower:"மலர்", grade:"தரம்", quantity:"அளவு", accepted:"ஏற்றுக்கொண்ட அளவு", rejected:"நிராகரித்த அளவு",
    rate:"அன்றைய விலை", amount:"தொகை", total:"மொத்தம்", adjusted:"முன்பணத்தில் கழித்தது",
    remaining:"மீதமுள்ள முன்பணம்", additionalPayable:"கூடுதல் பாக்கி", description:"விவரம்",
    paymentMode:"பணம் செலுத்தும் முறை", reference:"பரிவர்த்தனை எண்", partyType:"கணக்கு வகை",
    all:"அனைத்தும்", supplierTab:"சப்ளையர் கணக்கு", customerTab:"வாடிக்கையாளர் கணக்கு",
    debit:"பற்று", credit:"வரவு", balance:"இருப்பு", recordPayment:"சப்ளையருக்கு பணம் செலுத்து",
    recordReceipt:"வாடிக்கையாளர் பணம் பெறு", loginTitle:"மீண்டும் வரவேற்கிறோம்",
    loginSubtitle:"உங்கள் மலர் வணிகத்தை நிர்வகிக்க உள்நுழைக", username:"பயனர் பெயர்",
    password:"கடவுச்சொல்", signIn:"உள்நுழைக", demoHint:"சோதனை: admin / admin123",
    invalid:"தேவையான விவரங்களை சரியாக உள்ளிடவும்.", saved:"வெற்றிகரமாக சேமிக்கப்பட்டது (மாதிரி தரவு).",
    noData:"தரவு இல்லை", dashboardSub:"உங்கள் மொத்த விற்பனை வணிகத்தின் நிலவரம்",
    language:"English", status:"நிலை", actions:"செயல்கள்", edit:"திருத்து", delete:"நீக்கு",
    purchaseHistory:"கொள்முதல் வரலாறு", saleHistory:"விற்பனை வரலாறு", close:"மூடு"
  }
};
const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);
const money = n => "₹ " + Number(n || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 });
const today = () => new Date().toISOString().slice(0,10);

function App() {
  const [lang,setLang] = useState("en");
  const [suppliers,setSuppliers] = useState(()=>JSON.parse(localStorage.getItem("fw_suppliers")||"null")||seedSuppliers);
  const [customers,setCustomers] = useState(()=>JSON.parse(localStorage.getItem("fw_customers")||"null")||seedCustomers);
  const [ledger,setLedger] = useState(()=>JSON.parse(localStorage.getItem("fw_ledger")||"null")||seedLedger);
  const [stock,setStock] = useState(()=>JSON.parse(localStorage.getItem("fw_stock")||"null")||flowers);
  const [purchases,setPurchases] = useState(()=>JSON.parse(localStorage.getItem("fw_purchases")||"[]"));
  const [sales,setSales] = useState(()=>JSON.parse(localStorage.getItem("fw_sales")||"[]"));
  const [payments,setPayments] = useState(()=>JSON.parse(localStorage.getItem("fw_payments")||"[]"));
  const [receipts,setReceipts] = useState(()=>JSON.parse(localStorage.getItem("fw_receipts")||"[]"));
  const [token,setToken] = useState(()=>localStorage.getItem("fw_token"));
  const [toast,setToast] = useState("");
  const t = key => I18N[lang][key] || I18N.en[key] || key;
  const persist = (key,value,setter) => { setter(value); localStorage.setItem("fw_"+key,JSON.stringify(value)); };
  const notify = msg => { setToast(msg); window.clearTimeout(window.__fwToast); window.__fwToast=window.setTimeout(()=>setToast(""),2800); };
  const value = {lang,setLang,t,suppliers,setSuppliers,customers,setCustomers,ledger,setLedger,stock,setStock,
    purchases,setPurchases,sales,setSales,payments,setPayments,receipts,setReceipts,token,setToken,
    persist,notify,money,today};
  return <AppContext.Provider value={value}>
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/*" element={token ? <Shell/> : <Navigate to="/login" replace/>}/>
    </Routes>
    {toast && <div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
  </AppContext.Provider>;
}

function Login() {
  const {t,setToken,notify,lang,setLang} = useApp();
  const nav=useNavigate(); const [username,setUsername]=useState("admin"); const [password,setPassword]=useState("admin123");
  const [error,setError]=useState("");
  async function submit(e) {
    e.preventDefault(); setError("");
    if(!username.trim()||!password){setError(t("invalid"));return;}
    try {
      if (!DEMO_MODE) {
        const res=await api.post(endpoints.login,{username,password});
        const jwt=res.data?.token || res.data?.accessToken;
        if(!jwt) throw new Error("Login response did not contain a token");
        localStorage.setItem("fw_token",jwt); setToken(jwt);
      } else {
        if(username!=="admin" || password!=="admin123") throw new Error("Invalid demo credentials");
        localStorage.setItem("fw_token","demo-session"); setToken("demo-session");
      }
      nav("/");
    } catch(err) { setError(err.response?.data?.message || err.message || "Login failed"); }
  }
  return <div className="login-page">
    <div className="login-art"><div className="brand-mark"><Flower2 size={38}/></div><h1>Bloom & Balance</h1><p>Flower Wholesale Management</p><div className="flower-illustration">🌸 🌿 🌺</div><span>Grow · Trade · Prosper</span></div>
    <form className="login-card" onSubmit={submit}>
      <button type="button" className="language-switch" onClick={()=>setLang(lang==="en"?"ta":"en")}><Languages size={16}/>{t("language")}</button>
      <div className="eyebrow">FLOWER WHOLESALE ERP</div><h2>{t("loginTitle")}</h2><p>{t("loginSubtitle")}</p>
      <label>{t("username")}<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required/></label>
      <label>{t("password")}<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>
      {error && <div className="error-text"><AlertCircle size={15}/>{error}</div>}
      <button className="primary-btn full" type="submit">{t("signIn")} <ArrowUpRight size={17}/></button>
      {DEMO_MODE && <div className="demo-note">{t("demoHint")}</div>}
      <div className="login-foot">© {new Date().getFullYear()} Bloom & Balance</div>
    </form>
  </div>;
}

const navItems = [
  ["/","dashboard",LayoutDashboard],
  ["/suppliers","supplier",Users],
  ["/customers","customer",Store],
  ["/purchases","purchase",ShoppingCart],
  ["/sales","sales",ShoppingBag],
  ["/ledger","ledger",BookOpen],
  ["/payments","payment",Wallet]
];

function Shell() {
  const {t,lang,setLang,notify,setToken} = useApp();
  const [collapsed,setCollapsed]=useState(false); const nav=useNavigate(); const loc=useLocation();
  const titleKey=navItems.find(x=>x[0]===loc.pathname)?.[1]||"dashboard";
  function logout(){localStorage.removeItem("fw_token");setToken(null);nav("/login");}
  return <div className="app-shell">
    <aside className={`sidebar ${collapsed?"collapsed":""}`}>
      <div className="side-brand"><div className="brand-icon"><Flower2/></div>{!collapsed&&<div><b>Bloom & Balance</b><small>Wholesale ERP</small></div>}</div>
      <button className="collapse-btn" onClick={()=>setCollapsed(!collapsed)}><Menu size={17}/></button>
      <nav>{navItems.map(([path,key,Icon])=><NavLink key={path} to={path} end={path==="/"} title={t(key)} className={({isActive})=>isActive?"nav-link active":"nav-link"}><Icon size={19}/>{!collapsed&&<span>{t(key)}</span>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="sidebar-flower">🌷</div><button className="nav-link logout" onClick={logout}><LogOut size={19}/>{!collapsed&&<span>{t("logout")}</span>}</button></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div><div className="crumb">Bloom & Balance / <b>{t(titleKey)}</b></div><h1>{t(titleKey)}</h1></div>
        <div className="top-actions"><span className="online-pill"><span/> {t("offline")}</span><button className="icon-btn" title="Notifications"><Bell size={19}/></button><button className="language-btn" onClick={()=>setLang(lang==="en"?"ta":"en")}><Languages size={17}/>{lang==="en"?"தமிழ்":"English"}</button><div className="user-chip"><div className="avatar">A</div><div><b>Admin</b><small>Administrator</small></div><ChevronDown size={15}/></div></div>
      </header>
      <section className="page-content"><Routes>
        <Route path="/" element={<Dashboard/>}/><Route path="/suppliers" element={<Suppliers/>}/>
        <Route path="/customers" element={<Customers/>}/><Route path="/purchases" element={<PurchaseEntry/>}/>
        <Route path="/sales" element={<SalesEntry/>}/><Route path="/ledger" element={<Ledger/>}/>
        <Route path="/payments" element={<PaymentReceipt/>}/><Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes></section>
      <footer className="footer"><span>Bloom & Balance · Flower Wholesale Management</span><span>{DEMO_MODE?"Demo data stored on this PC":"Connected API: "+API_BASE_URL}</span></footer>
    </main>
  </div>;
}

function PageHeading({title,sub,action}) { return <div className="page-heading"><div><h2>{title}</h2>{sub&&<p>{sub}</p>}</div>{action}</div>; }
function Stat({label,value,icon:Icon,tone,trend}) { return <div className={`stat-card ${tone}`}><div className="stat-icon"><Icon size={22}/></div><div><span>{label}</span><strong>{value}</strong>{trend&&<small><TrendingUp size={13}/>{trend}</small>}</div></div>; }
function Panel({title,children,action}) { return <div className="panel"><div className="panel-head"><h3>{title}</h3>{action}</div>{children}</div>; }
function Dashboard() {
  const {t,suppliers,customers,stock,purchases,sales,money}=useApp();
  const totalAdvance=suppliers.reduce((a,x)=>a+x.advance,0), totalPayable=suppliers.reduce((a,x)=>a+x.payable,0);
  const totalDue=customers.reduce((a,x)=>a+x.receivable,0);
  const purchaseTotal=purchases.reduce((a,x)=>a+x.total,0)+25000, salesTotal=sales.reduce((a,x)=>a+x.total,0)+45000;
  return <>
    <div className="welcome-banner"><div><div className="eyebrow">THURSDAY · BUSINESS AT A GLANCE</div><h2>{t("welcome")}, Admin <span>🌼</span></h2><p>{t("dashboardSub")}</p></div><div className="banner-art">🌺 🌿 🌸</div></div>
    <div className="stats-grid">
      <Stat label={t("purchases")} value={money(purchaseTotal)} icon={ShoppingCart} tone="blue" trend="+12%"/>
      <Stat label={t("salesToday")} value={money(salesTotal)} icon={ShoppingBag} tone="green" trend="+18%"/>
      <Stat label={t("supplierAdvance")} value={money(totalAdvance)} icon={Wallet} tone="orange"/>
      <Stat label={t("customerDue")} value={money(totalDue)} icon={Users} tone="purple"/>
    </div>
    <div className="dashboard-grid">
      <Panel title={t("supplierLedger")} action={<span className="text-link">View all →</span>}>
        <div className="featured-supplier"><div className="person-flower">🌻</div><div className="grow"><b>{suppliers[0]?.name||"—"}</b><small>{suppliers[0]?.type} · {suppliers[0]?.phone}</small></div><div className="mini-metric"><small>Total advance</small><b>{money(50000)}</b></div><div className="mini-metric green"><small>Remaining</small><b>{money(suppliers[0]?.advance||0)}</b></div></div>
        <Table columns={["Date","Description","Debit (Advance)","Credit (Supply)","Balance"]} rows={[
          ["01 Nov","Advance paid",money(50000),"—",money(50000)],
          ["02 Nov","Flower delivery","—",money(5000),money(45000)],
          ["05 Nov","Flower delivery","—",money(6000),money(39000)],
          ["10 Nov","Flower delivery","—",money(9000),money(30000)]
        ]}/>
      </Panel>
      <Panel title={t("stock")}><div className="stock-list">{stock.map(f=><div className="stock-item" key={f.id}><span className="flower-emoji">{f.name==="Rose"?"🌹":f.name==="Jasmine"?"🌼":f.name==="Marigold"?"🌻":"🪷"}</span><b>{f.name}</b><span>{f.stock} {f.unit}</span></div>)}</div><div className="stock-foot"><Package size={15}/> Stock figures are sample data</div></Panel>
      <Panel title={t("quick")}><div className="quick-grid">{[[Users,t("addSupplier"),"/suppliers"],[Store,t("addCustomer"),"/customers"],[ShoppingCart,t("newPurchase"),"/purchases"],[ShoppingBag,t("newSale"),"/sales"],[BookOpen,t("ledger"),"/ledger"],[Wallet,t("payment"),"/payments"]].map(([Icon,label,path])=><NavLink to={path} className="quick-action" key={path}><Icon size={20}/><span>{label}</span></NavLink>)}</div></Panel>
      <Panel title={t("recentSales")}><Table columns={["Date","Customer","Amount","Balance"]} rows={[
        ["19 Nov","Kumar Flowers",money(7900),<b className="danger">{money(4900)}</b>],
        ["18 Nov","Rose Shop",money(12000),<b className="danger">{money(6000)}</b>],
        ["17 Nov","Fresh Flowers",money(15500),<b className="success">{money(0)}</b>]
      ]}/></Panel>
    </div>
  </>;
}

function Table({columns,rows}) {
  const {t}=useApp();
  return <div className="table-wrap"><table><thead><tr>{columns.map((c,i)=><th key={i}>{c}</th>)}</tr></thead><tbody>{rows.length?rows.map((r,i)=><tr key={i}>{r.map((cell,j)=><td key={j}>{cell}</td>)}</tr>):<tr><td colSpan={columns.length} className="empty">{t("noData")}</td></tr>}</tbody></table></div>;
}
function Field({label,children,required}) {return <label className="field"><span>{label}{required&&<i>*</i>}</span>{children}</label>;}
function Input(props){return <input className="input" {...props}/>;}
function Select({children,...props}){return <select className="input" {...props}>{children}</select>;}
function FormActions({onCancel,submitLabel}){const {t}=useApp();return <div className="form-actions"><button type="button" className="secondary-btn" onClick={onCancel}>{t("cancel")}</button><button type="submit" className="primary-btn">{submitLabel||t("save")}</button></div>;}

function Suppliers() {
  const {t,suppliers,setSuppliers,persist,notify,money}=useApp();
  const [query,setQuery]=useState(""); const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",location:"",type:"Farmer",advance:"0"});
  const filtered=suppliers.filter(x=>(x.name+x.phone+x.id).toLowerCase().includes(query.toLowerCase()));
  function submit(e){e.preventDefault();if(!form.name.trim()||!/^[0-9+\-\s]{8,15}$/.test(form.phone)||Number(form.advance)<0){notify(t("invalid"));return;}
    const item={...form,id:"SUP"+String(Date.now()).slice(-5),advance:Number(form.advance),payable:0};
    persist("suppliers",[item,...suppliers],setSuppliers);setShow(false);setForm({name:"",phone:"",location:"",type:"Farmer",advance:"0"});notify(t("saved"));}
  return <><PageHeading title={t("supplier")} sub="Manage flower farmers, traders and advance balances." action={<button className="primary-btn" onClick={()=>setShow(!show)}><Plus size={17}/>{t("addSupplier")}</button>}/>
    {show&&<Panel title={t("addSupplier")}><form onSubmit={submit} className="form-grid"><Field label={t("name")} required><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></Field><Field label={t("phone")} required><Input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required/></Field><Field label={t("address")}><Input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></Field><Field label={t("type")}><Select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Farmer</option><option>Trader</option><option>Farm</option></Select></Field><Field label={t("advance")}><Input type="number" min="0" value={form.advance} onChange={e=>setForm({...form,advance:e.target.value})}/></Field><div className="form-actions-cell"><FormActions onCancel={()=>setShow(false)}/></div></form></Panel>}
    <Panel title="Supplier directory" action={<div className="searchbox"><Search size={16}/><input placeholder={t("search")} value={query} onChange={e=>setQuery(e.target.value)}/></div>}>
      <Table columns={["Supplier ID",t("name"),t("phone"),t("type"),"Advance balance",t("payable"),t("actions")]} rows={filtered.map(x=>[x.id,x.name,x.phone,x.type,<b className="success">{money(x.advance)}</b>,<b className={x.payable?"danger":""}>{money(x.payable)}</b>,<button className="small-btn" onClick={()=>notify("Supplier details: "+x.name)}>{t("edit")}</button>])}/>
    </Panel>
  </>;
}

function Customers() {
  const {t,customers,setCustomers,persist,notify,money}=useApp(); const [query,setQuery]=useState("");const [show,setShow]=useState(false);
  const [form,setForm]=useState({name:"",phone:"",shop:"",creditLimit:"10000"});
  const filtered=customers.filter(x=>(x.name+x.phone+x.shop).toLowerCase().includes(query.toLowerCase()));
  function submit(e){e.preventDefault();if(!form.name.trim()||!form.shop.trim()||!/^[0-9+\-\s]{8,15}$/.test(form.phone)||Number(form.creditLimit)<0){notify(t("invalid"));return;}
    const item={...form,id:"CUS"+String(Date.now()).slice(-5),receivable:0,creditLimit:Number(form.creditLimit)};
    persist("customers",[item,...customers],setCustomers);setShow(false);notify(t("saved"));}
  return <><PageHeading title={t("customer")} sub="Manage wholesale buyers, flower shops and credit limits." action={<button className="primary-btn" onClick={()=>setShow(!show)}><Plus size={17}/>{t("addCustomer")}</button>}/>
    {show&&<Panel title={t("addCustomer")}><form onSubmit={submit} className="form-grid"><Field label={t("name")} required><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></Field><Field label={t("shop")} required><Input value={form.shop} onChange={e=>setForm({...form,shop:e.target.value})} required/></Field><Field label={t("phone")} required><Input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required/></Field><Field label={t("creditLimit")}><Input type="number" min="0" value={form.creditLimit} onChange={e=>setForm({...form,creditLimit:e.target.value})}/></Field><div className="form-actions-cell"><FormActions onCancel={()=>setShow(false)}/></div></form></Panel>}
    <Panel title="Customer directory" action={<div className="searchbox"><Search size={16}/><input placeholder={t("search")} value={query} onChange={e=>setQuery(e.target.value)}/></div>}>
      <Table columns={["Customer ID",t("name"),t("shop"),t("phone"),t("creditLimit"),t("receivable")]} rows={filtered.map(x=>[x.id,x.name,x.shop,x.phone,money(x.creditLimit),<b className={x.receivable?"danger":"success"}>{money(x.receivable)}</b>])}/>
    </Panel>
  </>;
}

function PurchaseEntry() {
  const {t,suppliers,setSuppliers,stock,setStock,purchases,setPurchases,ledger,setLedger,persist,notify,money,today}=useApp();
  const [supplierId,setSupplierId]=useState(suppliers[0]?.id||"");const [date,setDate]=useState(today());
  const [flowerId,setFlowerId]=useState(stock[0]?.id||"");const [qty,setQty]=useState("10");const [accepted,setAccepted]=useState("10");const [rate,setRate]=useState(String(stock[0]?.rate||0));const [desc,setDesc]=useState("");
  const flower=stock.find(f=>f.id===flowerId);const supplier=suppliers.find(s=>s.id===supplierId);
  const value=Number(accepted||0)*Number(rate||0);const adjusted=Math.min(value,supplier?.advance||0);const payable=value-adjusted;
  function chooseFlower(id){setFlowerId(id);const f=stock.find(x=>x.id===id);setRate(String(f?.rate||0));}
  function submit(e){e.preventDefault();if(!supplier||!flower||Number(qty)<=0||Number(accepted)<0||Number(accepted)>Number(qty)||Number(rate)<=0){notify(t("invalid"));return;}
    const item={id:"PUR"+Date.now(),date,supplierId,supplier:supplier.name,flower:flower.name,quantity:Number(qty),accepted:Number(accepted),rejected:Number(qty)-Number(accepted),rate:Number(rate),total:value,adjusted,payable,description:desc};
    const nextSup=suppliers.map(s=>s.id===supplierId?{...s,advance:s.advance-adjusted,payable:s.payable+payable}:s);
    const nextStock=stock.map(f=>f.id===flowerId?{...f,stock:f.stock+Number(accepted)}:f);
    const nextLedger=[{date,party:supplier.name,type:"Supplier",description:"Flower delivery - "+flower.name,debit:0,credit:adjusted},{date,party:supplier.name,type:"Supplier",description:"Supplier payable - "+flower.name,debit:0,credit:payable} ,...ledger];
    persist("suppliers",nextSup,setSuppliers);persist("stock",nextStock,setStock);persist("purchases",[item,...purchases],setPurchases);persist("ledger",nextLedger,setLedger);
    notify(t("saved"));setQty("10");setAccepted("10");setDesc("");
  }
  return <><PageHeading title={t("purchase")} sub="Record supplier flower deliveries and automatically settle advances."/>
    <Panel title="New flower delivery"><form onSubmit={submit} className="form-grid">
      <Field label={t("supplierName")} required><Select value={supplierId} onChange={e=>setSupplierId(e.target.value)}>{suppliers.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</Select></Field>
      <Field label={t("date")} required><Input type="date" value={date} onChange={e=>setDate(e.target.value)} required/></Field>
      <Field label={t("flower")} required><Select value={flowerId} onChange={e=>chooseFlower(e.target.value)}>{stock.map(f=><option value={f.id} key={f.id}>{f.name}</option>)}</Select></Field>
      <Field label={t("quantity")} required><Input type="number" min="0.01" step="0.01" value={qty} onChange={e=>{setQty(e.target.value);setAccepted(e.target.value)}} required/></Field>
      <Field label={t("accepted")} required><Input type="number" min="0" step="0.01" max={qty} value={accepted} onChange={e=>setAccepted(e.target.value)} required/></Field>
      <Field label={t("rejected")}><Input value={Math.max(0,Number(qty)-Number(accepted))} readOnly/></Field>
      <Field label={t("rate")+" (₹ / "+(flower?.unit||"KG")+")"} required><Input type="number" min="0.01" step="0.01" value={rate} onChange={e=>setRate(e.target.value)} required/></Field>
      <Field label={t("description")}><Input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Grade / quality / notes"/></Field>
      <div className="settlement-box"><div><small>Delivery value</small><b>{money(value)}</b></div><div><small>{t("adjusted")}</small><b>{money(adjusted)}</b></div><div><small>{t("remaining")}</small><b className="success">{money((supplier?.advance||0)-adjusted)}</b></div><div><small>{t("additionalPayable")}</small><b className="danger">{money(payable)}</b></div></div>
      <div className="form-actions-cell"><button className="primary-btn" type="submit">{t("save")} & settle advance</button></div>
    </form></Panel>
    <Panel title={t("purchaseHistory")}><Table columns={["Date","Supplier","Flower","Accepted qty","Rate","Value","Advance adjusted","Payable"]} rows={purchases.map(p=>[p.date,p.supplier,p.flower,p.accepted,p.rate,money(p.total),money(p.adjusted),money(p.payable)])}/></Panel>
  </>;
}

function SalesEntry() {
  const {t,customers,setCustomers,stock,setStock,sales,setSales,ledger,setLedger,persist,notify,money,today}=useApp();
  const [customerId,setCustomerId]=useState(customers[0]?.id||"");const [date,setDate]=useState(today());const [flowerId,setFlowerId]=useState(stock[0]?.id||"");const [qty,setQty]=useState("5");const [rate,setRate]=useState(String(stock[0]?.saleRate||0));const [received,setReceived]=useState("0");
  const flower=stock.find(f=>f.id===flowerId);const customer=customers.find(c=>c.id===customerId);const total=Number(qty||0)*Number(rate||0);const due=total-Number(received||0);
  function submit(e){e.preventDefault();if(!customer||!flower||Number(qty)<=0||Number(rate)<=0||Number(received)<0||Number(received)>total||Number(qty)>flower.stock){notify(t("invalid"));return;}
    const item={id:"SAL"+Date.now(),date,customer:customer.name,flower:flower.name,quantity:Number(qty),rate:Number(rate),total,received:Number(received),due};
    persist("customers",customers.map(c=>c.id===customerId?{...c,receivable:c.receivable+due}:c),setCustomers);
    persist("stock",stock.map(f=>f.id===flowerId?{...f,stock:f.stock-Number(qty)}:f),setStock);
    persist("sales",[item,...sales],setSales);
    persist("ledger",[{date,party:customer.name,type:"Customer",description:"Flower sale - "+flower.name,debit:total,credit:0},{date,party:customer.name,type:"Customer",description:"Payment received",debit:0,credit:Number(received)},...ledger],setLedger);
    notify(t("saved"));setQty("5");setReceived("0");
  }
  return <><PageHeading title={t("sales")} sub="Create wholesale sales invoices and track customer credit."/>
    <Panel title="New sales invoice"><form onSubmit={submit} className="form-grid">
      <Field label={t("customerName")} required><Select value={customerId} onChange={e=>setCustomerId(e.target.value)}>{customers.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</Select></Field>
      <Field label={t("date")} required><Input type="date" value={date} onChange={e=>setDate(e.target.value)}/></Field>
      <Field label={t("flower")} required><Select value={flowerId} onChange={e=>{setFlowerId(e.target.value);setRate(String(stock.find(f=>f.id===e.target.value)?.saleRate||0))}}>{stock.map(f=><option value={f.id} key={f.id}>{f.name} ({f.stock} {f.unit} available)</option>)}</Select></Field>
      <Field label={t("quantity")} required><Input type="number" min="0.01" step="0.01" max={flower?.stock} value={qty} onChange={e=>setQty(e.target.value)}/></Field>
      <Field label="Selling rate (₹)" required><Input type="number" min="0.01" step="0.01" value={rate} onChange={e=>setRate(e.target.value)}/></Field>
      <Field label="Amount received (₹)"><Input type="number" min="0" step="0.01" max={total} value={received} onChange={e=>setReceived(e.target.value)}/></Field>
      <div className="settlement-box"><div><small>{t("total")}</small><b>{money(total)}</b></div><div><small>Received</small><b className="success">{money(received)}</b></div><div><small>Customer credit</small><b className="danger">{money(due)}</b></div><div><small>Available stock</small><b>{flower?.stock||0} {flower?.unit}</b></div></div>
      <div className="form-actions-cell"><button className="primary-btn" type="submit">Save sales invoice</button></div>
    </form></Panel>
    <Panel title={t("saleHistory")}><Table columns={["Date","Customer","Flower","Quantity","Rate","Total","Received","Due"]} rows={sales.map(s=>[s.date,s.customer,s.flower,s.quantity,money(s.rate),money(s.total),money(s.received),money(s.due)])}/></Panel>
  </>;
}

function Ledger() {
  const {t,ledger,suppliers,customers,money}=useApp();const [tab,setTab]=useState("Supplier");const [query,setQuery]=useState("");
  const list=ledger.filter(x=>x.type===tab&&(x.party+x.description).toLowerCase().includes(query.toLowerCase()));
  return <><PageHeading title={t("ledger")} sub="Review supplier advances, customer receivables and transaction history."/>
    <div className="tab-row"><button className={tab==="Supplier"?"tab active":"tab"} onClick={()=>setTab("Supplier")}>{t("supplierTab")}</button><button className={tab==="Customer"?"tab active":"tab"} onClick={()=>setTab("Customer")}>{t("customerTab")}</button><div className="searchbox"><Search size={16}/><input placeholder={t("search")} value={query} onChange={e=>setQuery(e.target.value)}/></div></div>
    <Panel title={tab==="Supplier"?t("supplierTab"):t("customerTab")}><Table columns={[t("date"),"Party",t("description"),t("debit"),t("credit"),t("balance")]} rows={list.map(x=>[x.date,x.party,x.description,money(x.debit),money(x.credit),money(Math.abs(x.debit-x.credit))])}/></Panel>
    <div className="note-box"><AlertCircle size={17}/> Ledger shown here is a demo summary. Production accounting should use immutable double-entry journal entries and running balances from the backend.</div>
  </>;
}

function PaymentReceipt() {
  const {t,suppliers,customers,setSuppliers,setCustomers,payments,setPayments,receipts,setReceipts,ledger,setLedger,persist,notify,money,today}=useApp();
  const [tab,setTab]=useState("payment");const [partyId,setPartyId]=useState(suppliers[0]?.id||"");const [date,setDate]=useState(today());const [amount,setAmount]=useState("");const [mode,setMode]=useState("Cash");const [reference,setReference]=useState("");const [description,setDescription]=useState("");
  const partyList=tab==="payment"?suppliers:customers;const selected=partyList.find(x=>x.id===partyId);
  function switchTab(next){setTab(next);setPartyId(next==="payment"?(suppliers[0]?.id||""):(customers[0]?.id||""));setAmount("");}
  function submit(e){e.preventDefault();const n=Number(amount);if(!selected||!Number.isFinite(n)||n<=0){notify(t("invalid"));return;}
    const item={id:(tab==="payment"?"PAY":"REC")+Date.now(),date,party:selected.name,amount:n,mode,reference,description};
    if(tab==="payment"){
      persist("suppliers",suppliers.map(s=>s.id===partyId?{...s,payable:Math.max(0,s.payable-n)}:s),setSuppliers);
      persist("payments",[item,...payments],setPayments);
      persist("ledger",[{date,party:selected.name,type:"Supplier",description:"Supplier payment",debit:n,credit:0},...ledger],setLedger);
    } else {
      persist("customers",customers.map(c=>c.id===partyId?{...c,receivable:Math.max(0,c.receivable-n)}:c),setCustomers);
      persist("receipts",[item,...receipts],setReceipts);
      persist("ledger",[{date,party:selected.name,type:"Customer",description:"Customer receipt",debit:0,credit:n},...ledger],setLedger);
    }
    notify(t("saved"));setAmount("");setReference("");setDescription("");
  }
  const history=tab==="payment"?payments:receipts;
  return <><PageHeading title={t("payment")} sub="Record money paid to suppliers and collected from customers."/>
    <div className="tab-row"><button className={tab==="payment"?"tab active":"tab"} onClick={()=>switchTab("payment")}>Supplier payment</button><button className={tab==="receipt"?"tab active":"tab"} onClick={()=>switchTab("receipt")}>Customer receipt</button></div>
    <Panel title={tab==="payment"?t("recordPayment"):t("recordReceipt")}><form onSubmit={submit} className="form-grid">
      <Field label={tab==="payment"?t("supplierName"):t("customerName")} required><Select value={partyId} onChange={e=>setPartyId(e.target.value)}>{partyList.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</Select></Field>
      <Field label={t("date")}><Input type="date" value={date} onChange={e=>setDate(e.target.value)}/></Field>
      <Field label={t("amount")} required><Input type="number" min="0.01" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} required/></Field>
      <Field label={t("paymentMode")}><Select value={mode} onChange={e=>setMode(e.target.value)}><option>Cash</option><option>Bank transfer</option><option>UPI</option><option>Cheque</option></Select></Field>
      <Field label={t("reference")}><Input value={reference} onChange={e=>setReference(e.target.value)}/></Field>
      <Field label={t("description")}><Input value={description} onChange={e=>setDescription(e.target.value)}/></Field>
      <div className="form-actions-cell"><button className="primary-btn" type="submit">{t("save")}</button></div>
    </form></Panel>
    <Panel title="Recent transactions"><Table columns={[t("date"),"Party",t("amount"),t("paymentMode"),t("reference")]} rows={history.map(x=>[x.date,x.party,money(x.amount),x.mode,x.reference||"—"])}/></Panel>
  </>;
}

export default App;
