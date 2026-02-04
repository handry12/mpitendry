const API_BASE = '/api';
const ADMIN_TOKEN_KEY = 'mpitendry_admin_token';

const NETWORK_ERROR_MSG = 'Erreur réseau. Vérifiez votre connexion et que le serveur est démarré.';

async function parseError(res) {
  try {
    const data = await res.json();
    if (data && typeof data.error === 'string') return data.error;
  } catch {
    // Réponse non-JSON (ex. HTML d'erreur)
  }
  if (res.status === 401) return 'Non autorisé';
  if (res.status === 404) return 'Ressource introuvable';
  if (res.status >= 500) return 'Erreur serveur. Réessayez plus tard.';
  return res.statusText || NETWORK_ERROR_MSG;
}

function wrapNetworkError(err) {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    return new Error(NETWORK_ERROR_MSG);
  }
  return err;
}

export async function getStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  } catch (e) {
    throw wrapNetworkError(e);
  }
}

export async function getMembers() {
  try {
    const res = await fetch(`${API_BASE}/members`);
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  } catch (e) {
    throw wrapNetworkError(e);
  }
}

export async function getMemberById(id) {
  try {
    const res = await fetch(`${API_BASE}/members/${id}`);
    if (res.status === 404) throw new Error('Membre introuvable');
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  } catch (e) {
    throw wrapNetworkError(e);
  }
}

export async function createMember(payload) {
  try {
    const res = await fetch(`${API_BASE}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  } catch (e) {
    throw wrapNetworkError(e);
  }
}

// ——— Admin ———
export function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token) {
  if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
  else localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function adminHeaders() {
  const token = getAdminToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function adminLogin(password) {
  try {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error(await parseError(res));
    const data = await res.json();
    return data.token;
  } catch (e) {
    throw wrapNetworkError(e);
  }
}

export async function getAdminMembers() {
  try {
    const res = await fetch(`${API_BASE}/admin/members`, { headers: adminHeaders() });
    if (res.status === 401) {
      setAdminToken(null);
      throw new Error('Non autorisé');
    }
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  } catch (e) {
    throw wrapNetworkError(e);
  }
}

export async function deleteMember(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/members/${id}`, {
      method: 'DELETE',
      headers: adminHeaders(),
    });
    if (res.status === 401) {
      setAdminToken(null);
      throw new Error('Non autorisé');
    }
    if (res.status === 404) throw new Error('Membre introuvable');
    if (!res.ok) throw new Error(await parseError(res));
  } catch (e) {
    throw wrapNetworkError(e);
  }
}

export async function seedDemo() {
  try {
    const res = await fetch(`${API_BASE}/admin/seed-demo`, {
      method: 'POST',
      headers: adminHeaders(),
    });
    if (res.status === 401) {
      setAdminToken(null);
      throw new Error('Non autorisé');
    }
    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  } catch (e) {
    throw wrapNetworkError(e);
  }
}
