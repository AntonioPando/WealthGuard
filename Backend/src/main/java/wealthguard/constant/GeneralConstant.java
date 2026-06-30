package wealthguard.constant;

public class GeneralConstant {

     private GeneralConstant() {}

    public static final String ERROR = "ERROR";
    public static final String FORBIDDEN = "FORBIDDEN";
    public static final String OK = "OK";
    public static final String EXCEPTION = "exception";
    public static final String TYPE = "type";
    public static final String DATA = "data";

    public static final int GENERAL_ERROR_CODE = 1;
    public static final int BD_ERROR_CODE = 2;

    public static final int USUARIO_NO_VALIDO_ERROR_CODE = 3;

    public static final int GENERO_CON_USUARIO_ERROR_CODE = 4;

    public static final int USUARIO_NICK_YA_EXISTE_ERROR_CODE = 5;

    public static final int USUARIO_ID_NO_VALIDO_ERROR_CODE = 6;

    public static final int USUARIO_NO_ADMIN_ERROR_CODE = 7;

    public static final int PUESTO_DE_TRABAJO_CON_USUARIO_ERROR_CODE = 8;

    public static final int GENERO_YA_EXISTE_ERROR_CODE = 9;

    public static final int PUESTO_DE_TRABAJO_YA_EXISTE_ERROR_CODE = 10;
    public static final int NO_ENCONTRADO_ERROR_CODE = 404;

    public static final String GENERAL_ERROR_MESSAGE = "Error inesperado en el servidor";

    public static final String BD_ERROR_MESSAGE = "Error de Conexion a base de datos";

    public static final String USUARIO_NO_VALIDO_ERROR_MESSAGE = "El usuario y/o contraseña no son validos";

    public static final String GENERO_NO_ENCONTRADO_ERROR_MESSAGE = "El genero no ha sido encontrado";

    public static final String IMAGEN_DE_USUARIO_NO_ENCONTRADO_ERROR_MESSAGE = "Imagen de Usuario no ha sido encontrado";

    public static final String PUESTO_DE_TRABAJO_NO_ENCONTRADO_ERROR_MESSAGE = "El genero no ha sido encontrado";

    public static final String USUARIO_NO_ENCONTRADO_ERROR_MESSAGE = "El usuario no ha sido encontrado";

    public static final String GENERO_CON_USUARIO_ERROR_MESSAGE = "El genero no se puede borrar porque tiene al menos un usuario asignado";

    public static final String PUESTO_DE_TRABAJO_CON_USUARIO_ERROR_MESSAGE = "El puesto de trabajo no se puede borrar porque tiene al menos un usuario asignado";

    public static final String USUARIO_NICK_YA_EXISTE_ERROR_MESSAGE = "Ya existe un usuario con ese nickname";

    public static final String GENERO_YA_EXISTE_ERROR_MESSAGE = "Ya existe un genero con el mismo nombre";

    public static final String PUESTO_DE_TRABAJO_YA_EXISTE_ERROR_MESSAGE = "Ya existe un puesto de trabajo con el mismo nombre";

    public static final String DIRECCION_NO_ENCONTRADA_ERROR_MESSAGE = "La direccion no ha sido encontrada";

    public static final String USUARIO_ID_NO_VALIDO_ERROR_MESSAGE = "La id del usuario no puede ser null";
    public static final String DIRECCION_PRINCIPAL_NO_ENCONTRADA_ERROR_MESSAGE = "El usuario indicado no tiene direccion principal";

    public static final String USUARIO_NO_ADMIN_ERROR_MESSAGE = "El usuario no puede realizar esta operación porque no es admin";

}

