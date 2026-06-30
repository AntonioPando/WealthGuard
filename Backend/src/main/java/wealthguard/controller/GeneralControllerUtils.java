package wealthguard.controller;

import org.springframework.ui.ModelMap;

import wealthguard.constant.GeneralConstant;

public class GeneralControllerUtils {

      static ModelMap crearRespuestaModelMapOk(Object data) {
        ModelMap response = new ModelMap();
        response.put(GeneralConstant.TYPE, GeneralConstant.OK);
        response.put(GeneralConstant.EXCEPTION, null);
        response.put(GeneralConstant.DATA, data);
        return response;
    }

    static ModelMap crearRespuestaModelMapError(Exception ex) {
        ModelMap response = new ModelMap();
        response.put(GeneralConstant.TYPE, GeneralConstant.EXCEPTION);
        response.put(GeneralConstant.EXCEPTION, ex);
        response.put(GeneralConstant.DATA, null);
        return response;
    }

    //public static ResponseEntity crearRespuestaResponseEntity(HttpStatus httpStatus, Object data) {
    //    return ResponseEntity.status(httpStatus).body(data);
    //}

}

