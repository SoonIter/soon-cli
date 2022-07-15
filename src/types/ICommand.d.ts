declare interface ICommand {
  command: string;
  description: string;
  optionList: [string, string][];
  action: () => Promise<any>;
}