package com.zackmurry.raghavio.dao.player;

import com.zackmurry.raghavio.exception.InternalServerException;
import com.zackmurry.raghavio.model.PlayerEntity;
import com.zackmurry.raghavio.model.Position;
import org.flywaydb.core.internal.jdbc.JdbcTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;
import java.util.UUID;

@Repository
public class PlayerDataAccessService implements PlayerDao {

    private final JdbcTemplate jdbcTemplate;

    public PlayerDataAccessService(DataSource dataSource) throws SQLException {
        this.jdbcTemplate = new JdbcTemplate(dataSource.getConnection());
    }

    @Override
    public void createPlayer(@NonNull PlayerEntity playerEntity) {
        final String sql = "INSERT INTO players (id, game_id, player_name) VALUES (?, ?, ?)";
        try {
            final PreparedStatement preparedStatement = jdbcTemplate.getConnection().prepareStatement(sql);
            preparedStatement.setObject(1, playerEntity.getId());
            preparedStatement.setString(2, playerEntity.getGameId());
            preparedStatement.setString(3, playerEntity.getPlayerName());
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new InternalServerException();
        }
    }

    @Override
    public Optional<PlayerEntity> getPlayerById(@NonNull UUID id) {
        final String sql = "SELECT game_id, player_name, x, y, rotation FROM players WHERE id = ?";
        try {
            final PreparedStatement preparedStatement = jdbcTemplate.getConnection().prepareStatement(sql);
            preparedStatement.setObject(1, id);
            final ResultSet resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return Optional.of(
                        new PlayerEntity(
                                id,
                                resultSet.getString("game_id"),
                                resultSet.getString("player_name"),
                                resultSet.getInt("x"),
                                resultSet.getInt("y"),
                                resultSet.getShort("rotation")
                        )
                );
            }
            return Optional.empty();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new InternalServerException();
        }
    }

    @Override
    public void updatePositionOfPlayer(@NonNull UUID playerId, Position position, short rotation) {
        final String sql = "UPDATE players SET x = ?, y = ?, rotation = ? WHERE id = ?";
        try {
            final PreparedStatement preparedStatement = jdbcTemplate.getConnection().prepareStatement(sql);
            preparedStatement.setInt(1, position.getX());
            preparedStatement.setInt(2, position.getY());
            preparedStatement.setShort(3, rotation);
            preparedStatement.setObject(4, playerId);
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
            throw new InternalServerException();
        }
    }

}
