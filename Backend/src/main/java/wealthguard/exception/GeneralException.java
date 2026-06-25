package wealthguard.exception;

public class GeneralException extends RuntimeException  {

    public GeneralException(int codigoDeError, String mensajeDeError) {
        super(mensajeDeError);
        this.codigoDeError = codigoDeError;
        this.mensajeDeError = mensajeDeError;
    }

    private int codigoDeError;

    private String mensajeDeError;

    public int getCodigoDeError() {
        return codigoDeError;
    }

    public void setCodigoDeError(int codigoDeError) {
        this.codigoDeError = codigoDeError;
    }

    public String getMensajeDeError() {
        return mensajeDeError;
    }

    public void setMensajeDeError(String mensajeDeError) {
        this.mensajeDeError = mensajeDeError;
    }

}

