import { SafeResourceUrl } from "@angular/platform-browser";

export class JudocardModel {
    public Idf: number;
    public CatIdf: number;
    public ClasIdf: number;
    public Desafio: string;
    public Imagem: Blob;
    public Resposta: string
    public DataInc: Date;
    public CardIdf: number;
    public CatDes: string;
    public ClasDes: string;
    public Selecionado: string;
    public ImageUrl: string;
    public OnLine: string;
    public SorteReves: string;
    public ImgNom: string;
    public QuizLiberado: string;
    public JaRespondeu: Boolean;
    public QuizImgAux: SafeResourceUrl;
    public Quiz: string;
}