package com.papertrader.api.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
public class PositionController {
  @Autowired
  private PositionRepository positionRepository;

  
  @GetMapping("/positions")
  public List<Position> getAllPositions() {

    return positionRepository.findAll();
  }
  
  @GetMapping("/positions/id={id}/active")
  public List<Position> getAllActivePositionsById(@PathVariable(value = "id") String id) {

    return positionRepository.findAllActivePositionsByUser(id);
  }
  
  @GetMapping("/positions/id={id}/ticker={ticker}/active")
  public List<Position> getAllActivePositionsByIdAndTicker(@PathVariable(value = "id") String id, @PathVariable(value = "ticker") String ticker) {

    return positionRepository.findAllActivePositionsByUserAndTicker(id, ticker);
  }
  
  @GetMapping("/positions/id={id}/closed")
  public List<Position> getAllClosedPositionsById(@PathVariable(value = "id") String id) {

    return positionRepository.findAllClosedPositionsByUser(id);
  }
  
  @GetMapping("/positions/id={id}/ticker={ticker}/closed")
  public List<Position> getAllClosedPositionsByIdAndTicker(@PathVariable(value = "id") String id, @PathVariable(value = "ticker") String ticker) {

    return positionRepository.findAllClosedPositionsByUserAndTicker(id, ticker);
  }
  
  
  @PostMapping("/positions")
  public void postPosition(@RequestBody Position position) {
      positionRepository.save(position);
  }
  
  @DeleteMapping("/positions/id={id}")
  public void deletePositionsById(@PathVariable(value = "id") String id) {
	  positionRepository.deleteAllPositionsById(id);
  }
  
  
}