package com.community.productcommunity.controller;

import com.community.productcommunity.dto.StatsResponse;
import com.community.productcommunity.service.StatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/stats")
public class StatController {


    @Autowired
    StatService statService;

    @GetMapping
    public ResponseEntity<StatsResponse> getAllQuestions() {
        return ResponseEntity.ok(statService.getStats());
    }

}
