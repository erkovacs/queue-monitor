class Instance {
  API_URL = "/agent";
  constructor(instanceId, name, url, username, password) {
    this.instanceId = instanceId;
    this.name = name;
    this.url = url;
    this.username = username;
    this.password = password;
  }
  static async getById(instanceId) {
    const res = await fetch(`${this.API_URL}/${instanceId}`);
    const json = await res.json();
    const instance = new Instance(
      json.instanceId,
      json.name,
      url,
      username,
      password
    );
    return instance;
  }
}
