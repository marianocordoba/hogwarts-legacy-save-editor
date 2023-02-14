class Context {
  private context: Record<string, any> = {}

  get(key: string) {
    return this.context[key];
  }

  set(key: string, value: any) {
    this.context[key] = value;
  }
}

export default new Context();
