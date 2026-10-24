export const localClient = {
  auth: {
    getUser: async () => ({ id: 'local_user', name: 'Ananya' }),
    isAuthenticated: async () => true,
  },
  entities: {
    PeriodLog: {
      list: async () => JSON.parse(localStorage.getItem('saheli_health_vault') || '[]'),
      create: async (data) => {
        const cur = JSON.parse(localStorage.getItem('saheli_health_vault') || '[]');
        cur.push(data);
        localStorage.setItem('saheli_health_vault', JSON.stringify(cur));
        return data;
      }
    }
  }
};

export const base44 = localClient;