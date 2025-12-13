// admin.js - Logique pour la page admin 

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    try {
        await signInWithEmailAndPassword(window.auth, email, password);
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'block';
        loadData();
    } catch (error) {
        document.getElementById('loginError').textContent = 'Erreur : ' + error.message;
        document.getElementById('loginError').style.display = 'block';
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', async () => {
    await signOut(window.auth);
    document.getElementById('loginSection').style.display = 'block';
    document.getElementById('adminSection').style.display = 'none';
});

// Vérifier si connecté
onAuthStateChanged(window.auth, (user) => {
    if (user) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminSection').style.display = 'block';
        loadData();
    }
});

// Fonctions pour charger/afficher les données
async function loadData() {
    await loadClients();
    await loadRepairs();
    await loadSales();
}

async function loadClients() {
    const clientsList = document.getElementById('clientsList');
    clientsList.innerHTML = '';
    const querySnapshot = await getDocs(collection(window.db, 'clients'));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${data.nom} ${data.prenom} - ${data.tel} - ${data.model}`;
        clientsList.appendChild(li);
    });
}

async function loadRepairs() {
    const repairsList = document.getElementById('repairsList');
    repairsList.innerHTML = '';
    const querySnapshot = await getDocs(collection(window.db, 'repairs'));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `Client: ${data.clientId} - Problème: ${data.problem} - Statut: ${data.status}`;
        repairsList.appendChild(li);
    });
}

async function loadSales() {
    const salesList = document.getElementById('salesList');
    salesList.innerHTML = '';
    const querySnapshot = await getDocs(collection(window.db, 'sales'));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = `${data.model} - ${data.price}€ - ${data.desc}`;
        salesList.appendChild(li);
    });
}

// Ajouter un client
document.getElementById('addClientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nom = document.getElementById('clientNom').value;
    const prenom = document.getElementById('clientPrenom').value;
    const tel = document.getElementById('clientTel').value;
    const model = document.getElementById('clientModel').value;
    await addDoc(collection(window.db, 'clients'), { nom, prenom, tel, model });
    loadClients();
    e.target.reset();
});

// Ajouter une réparation (simplifié)
document.getElementById('addRepairForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const clientId = document.getElementById('repairClient').value;
    const problem = document.getElementById('repairProblem').value;
    const status = document.getElementById('repairStatus').value;
    await addDoc(collection(window.db, 'repairs'), { clientId, problem, status });
    loadRepairs();
    e.target.reset();
});

// Ajouter une annonce
document.getElementById('addSaleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const model = document.getElementById('saleModel').value;
    const price = document.getElementById('salePrice').value;
    const desc = document.getElementById('saleDesc').value;
    const image = document.getElementById('saleImage').value;
    await addDoc(collection(window.db, 'sales'), { model, price, desc, image });
    loadSales();
    e.target.reset();
});
