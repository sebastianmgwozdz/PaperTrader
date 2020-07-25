package com.papertrader.api.rest;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin
public class BalanceController {
  @Autowired
  private BalanceRepository balanceRepository;

  
  @GetMapping("/balances")
  public List<Balance> getAllBalances() {

    return balanceRepository.findAll();
  }
  
  @GetMapping("/balances/{id}")
  public Optional<Balance> getBalanceById(@PathVariable(value = "id") String id) {
	  return balanceRepository.findById(id);
	  
  }
  
  @PostMapping("/balances")
  public Balance postBalance(@RequestBody Balance balance) {
	  return balanceRepository.save(balance);
  }
  
  
  
  
  

  
  
}