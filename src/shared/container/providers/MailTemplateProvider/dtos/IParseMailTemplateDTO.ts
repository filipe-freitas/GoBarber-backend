interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTeplateDTO {
  file: string;
  variables: ITemplateVariables;
}
